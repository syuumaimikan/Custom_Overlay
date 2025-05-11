#include <napi.h>
#include <windows.h>

void SendMediaKey(WORD key)
{
    keybd_event(key, 0, 0, 0);               // Key down
    keybd_event(key, 0, KEYEVENTF_KEYUP, 0); // Key up
}

Napi::Value NextTrack(const Napi::CallbackInfo &info)
{
    SendMediaKey(VK_MEDIA_NEXT_TRACK);
    return info.Env().Undefined();
}

Napi::Value PrevTrack(const Napi::CallbackInfo &info)
{
    SendMediaKey(VK_MEDIA_PREV_TRACK);
    return info.Env().Undefined();
}

Napi::Value PlayPause(const Napi::CallbackInfo &info)
{
    SendMediaKey(VK_MEDIA_PLAY_PAUSE);
    return info.Env().Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set("next", Napi::Function::New(env, NextTrack));
    exports.Set("prev", Napi::Function::New(env, PrevTrack));
    exports.Set("playpause", Napi::Function::New(env, PlayPause));
    return exports;
}

NODE_API_MODULE(media_keys, Init)
