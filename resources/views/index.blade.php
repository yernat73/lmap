<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="api_token" content="{{ (Auth::user()) ? Auth::user()->api_token : '' }}">


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


    <body>
        <div class="ui left wide vertical menu sidebar">
            <div class="item">
                <button class="circular ui icon button back">
                    <i class="angle left icon"></i>
                </button>
                <h3 id="header">Find route</h3>
            </div>
            <div id="steps">
                <div class="ui middle aligned centered grid container" id="step-1">
                    <div class="row">
                        <div class="fourteen wide column">
                            <div class="item">
                                <div class="ui search start">
                                    <div class="ui transparent left icon fluid input">
                                        <input class="prompt" type="text" placeholder="Starting point" id="start">
                                        <i class="dot circle outline icon"></i>
                                        
                                    </div>
                                    <div class="results"></div>
                                </div>
                                    
                            </div>
                            <div class="item">
                                <div class="ui search destination">
                                    <div class="ui transparent left icon fluid input">
                                        <input class="prompt" type="text" placeholder="Destination" id="destination">
                                        <i class="map marker alternate icon"></i>
                                        
                                    </div>
                                    <div class="results"></div>
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <a class="" href="#" id="swap">
                                <i class="rotated grey exchange icon"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div id="step-2">
                </div>
            </div>
            <div class="container">
                <div id="route"></div>
            </div>
                
        </div>
        <div class="ui right sidebar bg-white">
            <script>
                var auth = {{Auth::check()? 1 : 0}};
            </script>
            
            @if(Auth::check())
                <div class="ui small text sticky-top menu bg-white border-bottom p-3 mt-2" style="">
                    <a class="item">
                        {{Auth::user()->name}}
                    </a>
                    <div class="ui right dropdown item">
                    Menu<i class="dropdown icon"></i>
                        <div class="menu">
                            <a class="item" id="refresh" href="#refresh"><i class="sync alternate icon" ></i>Refresh</a>
                            <a class="item" href="{{ url('/logout') }}"><i class="sign-out icon"></i>Log out</a>
                        </div>
                    </div>
               
                </div>
                <div class="ui container">
                    
                    <div class="">
                        <div class="ui inverted dimmer events">
                            <div class="ui text loader">Loading</div>
                            <p></p>
                            <p></p>
                        </div>
                        <div class="ui icon mini message" id="no_events">
                            <i class="database icon"></i>
                            <i class="close icon"></i>
                            <div class="content">
                                <div class="header">
                                Your history is empty!
                                </div>
                                <p>Start making trips.</p>
                            </div>
                        </div>
                        <div id="events" class="ui tiny divided selection list">
                            
                        </div>
                        <div id="event_template" hidden>
                            <div class="item">
                                <div class="right floated content ">
                                    <i class="ui x icon link event__delete"></i>
                                </div>
                                <div class="content">
                                    <div class="ui two column grid m-0">
                                        <div class="four wide column p-2"><div class="header">From</div></div>
                                    
                                        <div class="twelve wide column p-2"><div class="from"></div></div>
                                        
                                        <div class="four wide column p-2"><div class="header">To</div></div>
                                        
                                        <div class="twelve wide column p-2"><div class="to"></div></div>
                                        <div class="sixteen wide column date small p-2"></div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                    </div>

                            

                    
            </div>
            @else
                @include('login')
            @endif

        </div>
        <div class="pusher" id="page">
            <div class="ui container">
                <div class="ui secondary menu">
                    <div class="item">
                        <a class="item left-sidebar-toggle">
                            <i class="grey large sidebar icon mr-0"></i>
                        </a>
                    </div>
                    <div class="ui search route mx-auto item">
                        <div class="ui large transparent left icon input">
                            <input class="prompt" type="text" placeholder="Search routes...">
                            <i class="search link icon"></i>
                        </div>
                        <div class="results"></div>
                    </div>
                    <div class="item">
                        <a class="item right-sidebar-toggle" >
                            
                            <i class="grey large user outline icon mr-0"></i>
                        </a>
                    </div>

                
                    
                </div>
                
                    
            </div>
            <div id="map" class="mx-auto"></div>

        </div>

        <div id="contextMenu" hidden>
            
            <div class="ui vertical labeled icon mini basic buttons bg-white">
                <button class="ui button" id="dir_from_button">
                    <i class="dot circle outline icon"></i> 
                    Direction from
                </button>
                <button class="ui button" id="dir_to_button">
                    <i class="map marker alternate icon"></i> 
                    Direction to
                </button>
            </div>

        </div>


        

        <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBx7STG0PaXcrFVDiDqGsnr1AmMZcvf110&callback=initMap"></script>
        
        <script src="{{ URL::asset('js/javascript.js') }}"></script>
    </body>

</html>
