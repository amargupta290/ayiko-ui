package com.ayiko;

import com.facebook.react.bridge.*
import java.util.*

class MyNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MyNativeModule"
    }

    @ReactMethod
    fun getStaticData(promise: Promise) {
        try {
            // Simulating static data retrieval
            val staticData = "Your static data"
            promise.resolve(staticData)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}