<div class="ui grid container">
        <div class="column">
          
          <div class="ui stacked segment mt-3">
            <form class="ui mini form login" method="POST" action="{{ route('login') }}">
              @csrf
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
                <button type="submit" class="ui primary fluid mini submit button">{{ __('Login') }}</button>
            
        
              
        
            </form>
          </div>
          <div class="ui horizontal divider">or</div>
          
          <div class="ui stacked segment">
            <form class="ui mini form register" method="POST" action="{{ route('register') }}">
              @csrf
                <div class="ui header mt-0">
                  <div class="content">New to us?</div>
                  <div class="sub header">
                    Quick registration
                  </div>
                </div>
                <div class="ui error message"></div>
                <div class="field">
                  <div class="ui left icon input">
                    <i class="info icon"></i>
                    <input type="text" name="name" placeholder="Name">
                  </div>
                  @if ($errors->has('name'))
                    <span class="invalid-feedback" role="alert">
                      <strong>{{ $errors->first('name') }}</strong>
                    </span>
                  @endif
                  
                </div>
                <div class="field">
                  <div class="ui left icon input">
                    <i class="user icon"></i>
                    <input type="email" name="email" placeholder="E-mail address">
                  </div>
                  @if ($errors->has('email'))
                    <span class="invalid-feedback" role="alert">
                      <strong>{{ $errors->first('email') }}</strong>
                    </span>
                  @endif
                </div>
                <div class="field">
                  <div class="ui left icon input">
                    <i class="lock icon"></i>
                    <input type="password" name="password" placeholder="Password">
                  </div>
                  @if ($errors->has('password'))
                    <span class="invalid-feedback" role="alert">
                      <strong>{{ $errors->first('password') }}</strong>
                    </span>
                  @endif
                </div>
                <div class="field">
                  <div class="ui left icon input">
                    <i class="lock icon"></i>
                    <input type="password" name="password_confirmation" placeholder="Confirm password">
                  </div>
                </div>
                <button type="submit" class="ui positive fluid mini submit button">Submit</button>
          

            </form>
          </div>
        </div>
      </div>