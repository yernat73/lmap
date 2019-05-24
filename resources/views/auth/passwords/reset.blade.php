@extends('layouts.app')

@section('content')

    <div class="ui stacked segment mx-auto" style="max-width: 750px">
        <form class="ui form" method="POST" action="{{ route('password.update') }}">
            @csrf
            <input type="hidden" name="token" value="{{ $token }}">
            <div class="row">
                <div class="col-lg-6 col-md-8 col-sm-10 mx-auto mt-2 mb-4">
                   
                    <div class="ui header mt-0">
                        <div class="content">{{ __('Reset Password') }}</div>
                    </div>

                    <div class="field {{ $errors->has('email') ? 'error' : '' }}">
                        <label for="email">E-mail address</label>
                        <div class="ui left icon input">
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
                        <label for="password">Password</label>
                        <div class="ui left icon input">
                            <i class="lock icon"></i>
                            <input type="password" name="password" placeholder="Password" required>
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
                            <input type="password" name="password_confirmation" placeholder="Confirm password" required>
                        </div>
                    </div>
                    <button type="submit" class="ui fluid small primary submit button">{{ __('Reset Password') }}</button>
                </div>
            </div>
        </form>
    </div>
@endsection
