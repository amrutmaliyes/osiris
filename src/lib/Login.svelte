<script>
  import { invoke } from '@tauri-apps/api/tauri'
  import {push} from 'svelte-spa-router'
  let username = "bob2";
  let password = "secret456";
  
  let currentUser;

  async function handleButtonClick() {
    console.log('Check Login Function')
    const users = await invoke('get_all_users', { username, password })
    if(users){
      currentUser = users.username;
    }
    console.log('users:', users)
    push('/')
  }
</script>

<main>
  <div class="container-scroller">
    <div class="container-fluid page-body-wrapper full-page-wrapper">
      <div class="content-wrapper d-flex align-items-center auth">
        <div class="row flex-grow">
          <div class="col-lg-4 mx-auto">
            <div class="auth-form-light text-left p-5">
              <div class="brand-logo">
                <center>
                <!-- <img src="../images/icon.png">f -->
                </center>
              </div>
              <!-- <h4>Hello! let's get started</h4> -->
              <h6 class="font-weight-bold">Sign in to continue.{currentUser}</h6>
              <form class="pt-3">
                <div class="form-group">
                  <input type="email" class="form-control form-control-lg" id="exampleInputEmail1" placeholder="Username" bind:value={currentUser} >
                </div>
                <div class="form-group d-flex">
                  <input type="password" id="password" placeholder="Password" class="form-control" />
                  <i class="far fa-eye" id="togglePassword"></i>
                </div>
                <div class="mt-3">
                  <button type="button" class="btn btn-block btn-warning btn-lg font-weight-bold auth-form-btn" on:click={handleButtonClick}>SIGN IN</button>
                </div>
                <div class="my-2 d-flex justify-content-between align-items-center">
                  <a href="forgot-password.html" class="auth-link text-black">Forgot password?</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- content-wrapper ends -->
    </div>
    <!-- page-body-wrapper ends -->
  </div>
</main>