<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
        
        <!-- Fonts -->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
        
        <link rel="stylesheet" type="text/css" href="{{ asset('css/semantic.min.css') }}">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/components/icon.min.css" integrity="sha256-KyXPF3/VOPPst/NQOzCWr97QMfSfzJLyFT0o5lYJXiQ=" crossorigin="anonymous" />
 
        <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
        <script src="{{ asset('js/semantic.min.js') }}"></script>
    </head>


    <body>
        <div class="ui left wide vertical menu sidebar">
            <div class="item">
                <button class="circular ui icon button back">
                    <i class="angle left icon"></i>
                </button>
                <h3 class="">Find route</h3>
            </div>
            <div class="step-1 ui middle aligned centered grid container">
                <div class="row">
                        <div class="fourteen wide column">
                            <div class="item">
                                <div class="ui transparent left icon input">
                                    <input type="text" placeholder="Starting point">
                                    <i class="dot circle outline icon"></i>
                                    
                                </div>
                            </div>
                            <div class="item">
                                <div class="ui transparent left icon input">
                                    <input type="text" placeholder="Destination">
                                    <i class="map marker alternate icon"></i>
                                </div>
                            </div>
                        </div>
                        <div class="two wide column">
                            <a class="ui grey" href="#">
                                <i class="rotated exchange icon"></i>
                            </a>
                        </div>
                </div>
            </div>
                
        </div>
        <div class="ui right vertical menu thin sidebar">
        </div>
        <div class="dimmed pusher">
            <div class="full height">
                <div class="ui container">
                    <div class="ui secondary menu">
                        <div class="item">
                            <a class="view-ui item left-sidebar-toggle">
                                <i class="grey large sidebar icon mr-0"></i>
                            </a>
                        </div>
                        <div class="ui search mx-auto item">
                            <div class="ui large transparent left icon input">
                                <input class="prompt" type="text" placeholder="Search routes...">
                                <i class="search link icon"></i>
                            </div>
                            <div class="results"></div>
                        </div>
                        <div class="item">
                            <a class="view-ui item right-sidebar-toggle" >
                                <i class="grey large sidebar icon mr-0"></i>
                            </a>
                        </div>

                    
                        
                    </div>
                        
                </div>
                
            </div>
        </div>


        
        <script src="{{ URL::asset('js/javascript.js') }}"></script>
    </body>

</html>
