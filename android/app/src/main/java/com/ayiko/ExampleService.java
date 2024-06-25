package com.ayiko;

import android.app.Notification;

import android.app.PendingIntent;

import android.app.Service;

import android.content.Context;

import android.content.Intent;

import android.os.Handler;

import android.os.IBinder;

import android.os.PowerManager;

import androidx.core.app.NotificationCompat;

import android.app.NotificationManager;

import android.app.NotificationChannel;

import android.os.Build;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import com.google.android.gms.location.FusedLocationProviderClient;

import com.google.android.gms.location.LocationCallback;

import com.google.android.gms.location.LocationResult;

import com.google.android.gms.location.LocationServices;


import com.google.android.gms.location.LocationRequest;

import android.location.Location;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;



import android.util.Log;

public class ExampleService extends Service {

    private static final int SERVICE_NOTIFICATION_ID = 100001;

    private static final String CHANNEL_ID = "EXAMPLE";

    private FusedLocationProviderClient fusedLocationClient;

    private LocationCallback locationCallback;

    private Handler handler = new Handler();

    private Runnable runnableCode = new Runnable() {

        @Override

        public void run() {

            Context context = getApplicationContext();

            Intent myIntent = new Intent(context, ExampleEventService.class);

            context.startService(myIntent);
            Log.w("EXAMPLE", "ExampleService run or start service");
            HeadlessJsTaskService.acquireWakeLockNow(context);

            handler.postDelayed(this, 10000); // 5 Min

        }

    };

    private PowerManager.WakeLock wakeLock;


    @Override

    public IBinder onBind(Intent intent) {

        return null;

    }

    @Override

    public void onCreate() {

        super.onCreate();
        PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "ExampleService::WakeLock");
        wakeLock.acquire();

           fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
           locationCallback = new LocationCallback() {
               @Override
               public void onLocationResult(LocationResult locationResult) {
                   if (locationResult == null) {
                       return;
                   }
                   for (Location location : locationResult.getLocations()) {
                       // Send location data to React Native
                       sendLocationToRN(location);
                   }
               }
           };
    }

    private String makeGetRequest(String urlString) {
        HttpURLConnection urlConnection = null;
        BufferedReader reader = null;
        String response = null;

        try {
            URL url = new URL(urlString);
            urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestMethod("GET");

            // Read the response
            StringBuilder sb = new StringBuilder();
            reader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
            response = sb.toString();
        } catch (IOException e) {
            Log.e("MyService", "Error making API GET request", e);
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    Log.e("MyService", "Error closing reader", e);
                }
            }
        }

        return response;
    }

    private void startLocationUpdates() {
        Log.w("EXAMPLE", "startLocationUpdates");

        fusedLocationClient.requestLocationUpdates(createLocationRequest(),
                locationCallback,
                null /* Looper */);
    }

    private void sendLocationToRN(Location location) {
        WritableMap params = Arguments.createMap();
        params.putDouble("latitude", location.getLatitude());
        params.putDouble("longitude", location.getLongitude());

        String jsonString = params.toString();
        Log.w("EXAMPLE", jsonString);
        // Send event to React Native
        ExampleModule.sendEvent("LocationUpdateEvent", params);
    }

    private LocationRequest createLocationRequest() {
        Log.w("EXAMPLE", "createLocationRequest");
        LocationRequest locationRequest = LocationRequest.create();
        locationRequest.setInterval(10000); // Update interval in milliseconds (10 seconds)
        locationRequest.setFastestInterval(5000); // Fastest update interval in milliseconds (5 seconds)
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        return locationRequest;
    }

    private void stopLocationUpdates() {
        Log.w("EXAMPLE", "stopLocationUpdates");
        fusedLocationClient.removeLocationUpdates(locationCallback);
    }

    

    @Override

    public void onDestroy() {

        super.onDestroy();

        this.handler.removeCallbacks(this.runnableCode);
           stopLocationUpdates();
        wakeLock.release();

    }

    @Override

    public int onStartCommand(Intent intent, int flags, int startId) {

        this.handler.post(this.runnableCode);

        // The following code will turn it into a Foreground background process (Status bar notification)

        Intent notificationIntent = new Intent(this, MainActivity.class);

        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent,
                PendingIntent.FLAG_IMMUTABLE);

        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        NotificationChannel chan = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            chan = new NotificationChannel("NOTIFICATION_CHANNEL_ID",
                    "channelName", manager.IMPORTANCE_NONE);
            chan.setDescription("for muting");

            assert manager != null;
            manager.createNotificationChannel(chan);

            manager.createNotificationChannel(
                    new NotificationChannel("name", "Muter", NotificationManager.IMPORTANCE_DEFAULT));

            NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this,
                    "NOTIFICATION_CHANNEL_ID");
            Notification notification = notificationBuilder.setOngoing(true)
                    .setContentTitle("appname")
                    .setPriority(NotificationManager.IMPORTANCE_MIN)
                    .setCategory(Notification.CATEGORY_SERVICE)
                    .build();

                       startLocationUpdates();
            startForeground(4, notification);
        } else {
                   startLocationUpdates();
            startForeground(3, new Notification());
        }

        //       Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
        //
        //               .setContentIntent(contentIntent)
        //
        //               .setOngoing(true)
        //
        //               .build();
        //
        //       startForeground(SERVICE_NOTIFICATION_ID, notification);
//        WritableMap data = Arguments.createMap();
//        data.putString("key", "value"); // Add your data here
//
//        ExampleModule.sendEvent("YourEventName", data);

        return START_STICKY_COMPATIBILITY;

    }

}
