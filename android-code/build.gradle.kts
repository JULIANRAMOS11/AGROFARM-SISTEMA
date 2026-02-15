// ═══════════════════════════════════════════════════════════════════
// build.gradle.kts (Module: app)
// ═══════════════════════════════════════════════════════════════════
// INSTRUCCIONES: Copiar estas dependencias a tu archivo build.gradle

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.agrofarm.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.agrofarm.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    
    kotlinOptions {
        jvmTarget = "1.8"
    }
    
    // ⚠️ IMPORTANTE: Habilitar ViewBinding
    buildFeatures {
        viewBinding = true
    }
}

dependencies {

    // ═══ ANDROID CORE ═══
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    
    // ═══ RETROFIT - Para peticiones HTTP al backend ═══
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    
    // ═══ OKHTTP - Cliente HTTP y logging ═══
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // ═══ GSON - Para parsear JSON ═══
    implementation("com.google.code.gson:gson:2.10.1")
    
    // ═══ COROUTINES - Para operaciones asíncronas ═══
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    
    // ═══ LIFECYCLE - ViewModel y LiveData ═══
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    
    // ═══ ACTIVITY KTX - Para lifecycleScope ═══
    implementation("androidx.activity:activity-ktx:1.8.2")
    implementation("androidx.fragment:fragment-ktx:1.6.2")
    
    // ═══ RECYCLERVIEW - Para listas ═══
    implementation("androidx.recyclerview:recyclerview:1.3.2")
    
    // ═══ SWIPE REFRESH - Para pull-to-refresh ═══
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    
    // ═══ GLIDE - Para cargar imágenes (opcional) ═══
    implementation("com.github.bumptech.glide:glide:4.16.0")
    
    // ═══ TESTING ═══
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}
