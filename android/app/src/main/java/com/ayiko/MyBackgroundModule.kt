package com.ayiko

import android.os.AsyncTask
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MyBackgroundModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MyBackgroundModule"
    }

    @ReactMethod
    fun performBackgroundTask(promise: Promise) {
        object : AsyncTask<Void, Void, String>() {
            override fun doInBackground(vararg params: Void): String {
                // Simulate background processing
                try {
                    Thread.sleep(5000) // Simulate 5 seconds of processing
                } catch (e: InterruptedException) {
                    e.printStackTrace()
                }
                return "Background task completed"
            }

            override fun onPostExecute(result: String) {
                promise.resolve(result) // Resolve promise with result
            }
        }.execute()
    }
}
