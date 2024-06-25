package com.ayiko;

import android.content.Intent;

import android.os.Bundle;

import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;

import com.facebook.react.bridge.Arguments;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import android.util.Log;

public class ExampleEventService extends HeadlessJsTaskService {

   @Nullable

   protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {

       WritableMap latLongMap = Arguments.createMap();
       latLongMap.putString("lat", "Shivam");
       latLongMap.putString("long", "Dixit");

       // Serialize the WritableMap to JSON string
//       String jsonString = latLongMap.toString();

       Log.w("ExampleEventService", "HeadlessJsTaskConfig run or start service");


       Bundle extras = intent.getExtras();
       
       Log.w("ExampleEventService", "HeadlessJsTaskConfig run or start service");

       return new HeadlessJsTaskConfig(

               "Example",



               latLongMap,

               5000,

               true);

   }

}
