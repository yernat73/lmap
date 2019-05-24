@extends('layouts.app')

@section('content')
    <div class="ui stacked segment mx-auto" style="max-width: 750px">
        <form class="ui form" method="POST" action="{{ route('password.email') }}">
            @csrf
            <div class="row">
                <div class="col-lg-6 col-md-8 col-sm-10 mx-auto mt-2 mb-4">
                   
                    <div class="ui header mt-0">
                        <div class="content">
                            {{ __('Reset Password') }}
                            <div class="sub header">
                                Please provide a <b>email</b> address.
                            </div>
                        </div>
                        
                    </div>
                    @if (session('status'))
                        <div class="ui success visible small message">
                            <p>{{ session('status') }}</p>
                        </div>
                    @endif
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
                    <button type="submit" class="ui fluid small primary submit button">{{ __('Send Password Reset Link') }}</button>
                </div>
            </div>
        </form>
    </div>
@endsection
