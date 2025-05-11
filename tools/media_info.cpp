#include <napi.h>
#include <winrt/Windows.Media.Control.h>
#include <winrt/Windows.Foundation.h>
#include <string>
#include <codecvt>
#include <locale>
#include <iostream>
#include <sstream>

std::string to_utf8(const std::wstring &wstr)
{
    if (wstr.empty())
        return "";

    try
    {
        std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
        return converter.to_bytes(wstr);
    }
    catch (const std::exception &e)
    {
        return std::string("Conversion error: ") + e.what();
    }
}

std::string safeToString(const winrt::hstring &str)
{
    if (str.empty())
    {
        return "";
    }
    return to_utf8(str.c_str());
}

Napi::Object GetMediaInfo(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    Napi::Object result = Napi::Object::New(env);

    try
    {

        using namespace winrt::Windows::Media::Control;

        // メディアマネージャーを取得
        auto managerOperation = GlobalSystemMediaTransportControlsSessionManager::RequestAsync();
        auto manager = managerOperation.get();

        if (!manager)
        {
            result.Set("error", "Failed to get media manager");
            return result;
        }

        auto session = manager.GetCurrentSession();
        if (!session)
        {
            result.Set("error", "No active media session");
            return result;
        }
        // 再生中のアプリIDを取得
        auto appId = session.SourceAppUserModelId();
        std::string appName = to_utf8(appId.c_str());
        result.Set("app", Napi::String::New(env, appName));

        auto propertiesOperation = session.TryGetMediaPropertiesAsync();
        auto mediaProperties = propertiesOperation.get();

        if (!mediaProperties)
        {
            result.Set("error", "Failed to get media properties");
            return result;
        }

        // メディア情報を取得
        std::string title = safeToString(mediaProperties.Title());
        std::string artist = safeToString(mediaProperties.Artist());
        std::string album = safeToString(mediaProperties.AlbumTitle());

        // 値をセット
        result.Set("title", Napi::String::New(env, title));
        result.Set("artist", Napi::String::New(env, artist));
        result.Set("album", Napi::String::New(env, album));

        return result;
    }
    catch (const winrt::hresult_error &e)
    {
        std::string errorMsg = "WinRT Error: ";
        errorMsg += to_utf8(e.message().c_str());
        errorMsg += " (HRESULT: 0x";
        char hexBuffer[20];
        sprintf(hexBuffer, "%08X", static_cast<unsigned int>(e.code()));
        errorMsg += hexBuffer;
        errorMsg += ")";
        result.Set("error", errorMsg);
    }
    catch (const std::exception &e)
    {
        result.Set("error", std::string("C++ Exception: ") + e.what());
    }
    catch (...)
    {
        result.Set("error", "Unknown error occurred in native module");
    }

    return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set("getMediaInfo", Napi::Function::New(env, GetMediaInfo));
    return exports;
}

NODE_API_MODULE(media_info, Init)