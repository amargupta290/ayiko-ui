package com.ayiko

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Handler
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.*

class BackgroundService(reactContext: ReactApplicationContext) : Service() {

//    private lateinit var reactContext: ReactApplicationContext

    private val reactContext: ReactApplicationContext = reactContext

    companion object {
        private const val INTERVAL_MS: Long = 10 * 1000 // 10 seconds
    }

    private lateinit var handler: Handler
    private lateinit var timer: Timer


    override fun onCreate() {
        super.onCreate()
        handler = Handler()
        timer = Timer()
        startRepeatingTask()
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun startRepeatingTask() {
        timer.scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                sendEvent()
            }
        }, 0, INTERVAL_MS)
    }

    private fun sendEvent() {
        handler.post {
            val reactContext = reactContext
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("BackgroundEvent", "Native log from background service")
        }
    }

    // Create a persistent notification
//    private fun createNotification(): Notification {
//        val intent = Intent(reactContext, MainActivity::class.java)
//        val pendingIntent = PendingIntent.getActivity(reactContext, 0, intent,0)
//        // .setSmallIcon(R.drawable.ic_notification)
//        return NotificationCompat.Builder(reactContext, "channel_id")
//            .setContentTitle("Background Service")
//            .setContentText("Running...")
//            .setContentIntent(pendingIntent)
//            .build()
//    }
}
