{
  "targets": [
    {
      "target_name": "media_info",
      "sources": [ "media_info.cpp" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "msvs_settings": {
        "VCCLCompilerTool": {
          "AdditionalOptions": ["/std:c++17", "/await", "/EHsc"],
          "AdditionalUsingDirectories": [
            "C:/Program Files (x86)/Windows Kits/10/UnionMetadata/10.0.19041.0",
            "C:/Program Files (x86)/Windows Kits/10/Include/10.0.19041.0/um",
            "C:/Program Files (x86)/Windows Kits/10/Include/10.0.19041.0/winrt"
          ]
        },
        "VCLinkerTool": {
          "AdditionalDependencies": ["windowsapp.lib"]
        }
      },
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
      }
    }
  ]
}