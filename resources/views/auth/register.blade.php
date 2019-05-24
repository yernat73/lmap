@extends('layouts.app')

@section('content')
<!--
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Register') }}</div>

                <div class="card-body">
                    <form method="POST" action="{{ route('register') }}">
                        @csrf

                        <div class="form-group row">
                            <label for="name" class="col-md-4 col-form-label text-md-right">{{ __('Name') }}</label>

                            <div class="col-md-6">
                                <input id="name" type="text" class="form-control{{ $errors->has('name') ? ' is-invalid' : '' }}" name="name" value="{{ old('name') }}" required autofocus>

                                @if ($errors->has('name'))
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $errors->first('name') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="email" class="col-md-4 col-form-label text-md-right">{{ __('E-Mail Address') }}</label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email" value="{{ old('email') }}" required>

                                @if ($errors->has('email'))
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="password" class="col-md-4 col-form-label text-md-right">{{ __('Password') }}</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" required>

                                @if ($errors->has('password'))
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $errors->first('password') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="password-confirm" class="col-md-4 col-form-label text-md-right">{{ __('Confirm Password') }}</label>

                            <div class="col-md-6">
                                <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required>
                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-6 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    {{ __('Register') }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

-->

    <div class="mx-auto" style="max-width: 750px">
        <div class="ui stacked segment">
            <form class="ui form" method="POST" action="{{ route('register') }}">
                <div class="row">
                    <div class="col-lg-6 col-md-8 col-sm-10 mx-auto mt-2 mb-4">
                        @csrf
                        <div class="ui header mt-0">
                            <div class="content">Registration</div>
                        </div>
                        
                        <div class="field {{ $errors->has('name') ? 'error' : '' }}">
                            <label for="name">Name</label>
                            <div class="ui left icon input">
                                <i class="info icon"></i>
                                <input type="text" name="name" placeholder="Name" value="{{ old('name') }}" required autofocus>
                            </div>
                            @if ($errors->has('name'))
                                <div class="ui basic red pointing prompt label">
                                    {{ $errors->first('name') }}
                                </div>
                            @endif
                            
                        </div>
                        <div class="field {{ $errors->has('email') ? 'error' : '' }}">
                            <label for="email">E-mail address</label>
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input type="email" name="email" placeholder="E-mail address" value="{{ old('email') }}" required>
                            </div>
                            @if ($errors->has('email'))
                                <div class="ui basic red pointing prompt label">
                                    {{ $errors->first('email') }}
                                </div>
                            @endif
                        </div>
                        <div class="field {{ $errors->has('password') ? 'error' : '' }}">
                            <label for="password">Password</label>
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input type="password" name="password" placeholder="Password">
                            </div>
                            @if ($errors->has('password'))
                                <div class="ui basic red pointing prompt label">
                                {{ $errors->first('password') }}
                                </div>
                            @endif  
                        </div>
                        <div class="field">
                            <label for="password_confirmation">Confirm password</label>
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input type="password" name="password_confirmation" placeholder="Confirm password">
                            </div>
                        </div>
                        <button type="submit" class="ui fluid primary submit button">Sign up</button>
                                        
                    </div>
                </div>
            </form>
        </div>
    
        <div class="ui segment bg-white text-center mb-5">
            <div class="row">
                <div class="col-lg-6 col-md-8 col-sm-10 mx-auto my-3">
                    <span class="align-middle" style="font-size: 0.95rem;">Have an account? <a href="{{ route('login') }}" class=""> <b>Log in</b> </a></span> 
                </div>
            </div>
        </div>
    </div>
    

    


    

@endsection
