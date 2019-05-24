@extends('layouts.app')

@section('content')
    <div class="mx-auto" style="max-width: 750px">
        <div class="ui stacked segment" >
            <form class="ui form" method="POST" action="{{ route('login') }}">
                @csrf
                <div class="row">
                    <div class="col-lg-6 col-md-8 col-sm-10 mx-auto mt-2 mb-4">
                        <div class="ui header mt-0">
                            <div class="content">
                                {{ __('Login') }}
                            </div>
                        </div>
                        <div class="field {{ $errors->has('email') ? 'error' : '' }}">
                            <div class="ui left icon input ">
                                <i class="user icon"></i>
                                <input type="email" name="email" placeholder="E-mail address" value="{{ old('email') }}" required autofocus>
                            </div>
                            @if ($errors->has('email'))
                                <div class="ui basic red pointing prompt label">
                                {{ $errors->first('email') }}
                                </div>
                            @endif
                        
                        </div>
                        <div class="field {{ $errors->has('password') ? 'error' : '' }}">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input type="password" name="password" placeholder="Password" required >
                                
                            </div> 
                            @if ($errors->has('password'))
                                <div class="ui basic red pointing prompt label">
                                {{ $errors->first('password') }}
                                </div>
                            @endif                 
                        </div>
                        <div class="field">
                            <div class="ui checkbox">
                                <input type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                                <label for="remember">Remember Me</label>
                            </div>
                        </div>
                        <button type="submit" class="ui primary fluid submit button">{{ __('Log in') }}</button>
                        <div class="ui horizontal divider">or</div>
                        <div class="text-center">
                            
                            <a class="small" href="{{ route('password.request') }}">
                                {{ __('Forgot your password?') }}
                            </a>
                        </div>
                    </div>
                </div>
                
            </form>
            
            
        </div>
        <div class="ui segment bg-white text-center">
            <div class="row">
                <div class="col-lg-6 col-md-8 col-sm-10 mx-auto my-3">
                    <span class="align-middle" style="font-size: 0.95rem;">Don't have an account? <a href="{{ route('register') }}" class=""> <b>Sign up</b> </a></span> 
                </div>
            </div>
        </div>
    </div>
    
@endsection
