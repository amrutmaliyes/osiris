<script>
    import { push } from 'svelte-spa-router';
    function signOutHandler(event){
        event.preventDefault();
        push('/login');
    }
</script>

<nav class="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
    <div class="navbar-brand-wrapper d-flex align-items-center">
        <a class="navbar-brand brand-logo" href="../index.html">
            <img src="../images/icon.png" alt="logo" class="logo-dark" />
        </a>
    </div>
    <div class="navbar-menu-wrapper d-flex align-items-center flex-grow-1">
        <h5 class="mb-0 font-weight-medium d-none d-lg-flex">Welcome!</h5>
        <ul class="navbar-nav navbar-nav-right ml-auto">
            <a href="#" on:click={signOutHandler}
                ><i
                    class="dropdown-item-icon icon-power text-primary"
                />&nbsp;Sign Out</a
            >
        </ul>
        <button
            class="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
            type="button"
            data-toggle="offcanvas"
        >
            <span class="icon-menu" />
        </button>
    </div>
</nav>
