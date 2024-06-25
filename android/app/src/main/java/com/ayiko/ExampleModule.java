package com.ayiko;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;

import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.ReactMethod;

import android.util.Log;

import javax.annotation.Nonnull;

import com.facebook.react.modules.core.DeviceEventManagerModule;

public class ExampleModule extends ReactContextBaseJavaModule {

   public static final String REACT_CLASS = "Example";

   private static ReactApplicationContext reactContext;

   public ExampleModule(@Nonnull ReactApplicationContext reactContext) {

       super(reactContext);

       this.reactContext = reactContext;

   }

   @Nonnull

   @Override

   public String getName() {

       return REACT_CLASS;

   }

   @ReactMethod

   public void startService() {

       this.reactContext.startService(new Intent(this.reactContext, ExampleService.class));

   }

   @ReactMethod

   public void stopService() {

       this.reactContext.stopService(new Intent(this.reactContext, ExampleService.class));

   }

   // Method to emit events to JavaScript side
    public static void sendEvent(String eventName, Object data) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, data);
    }

}
