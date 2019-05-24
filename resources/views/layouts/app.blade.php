<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Map</title>
    <!-- Fonts -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/semantic.min.css') }}">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/components/icon.min.css" integrity="sha256-KyXPF3/VOPPst/NQOzCWr97QMfSfzJLyFT0o5lYJXiQ=" crossorigin="anonymous" />
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" />

    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>     
    <script src="{{ asset('js/semantic.min.js') }}"></script>
</head>
<body class="h-100">
    
    <div class="ui large top fixed menu">
        <div class="ui container">
            <a href="/" class="circular ui icon button p-3 m-2">
                <i class="angle left icon"></i>
            </a>
        </div>
    </div>
    
    <div class="bg-light h-100 pt-5">
        <div class="ui container pt-5 h-100">
            @yield('content')
        </div>
    </div>
</body>
</html>
