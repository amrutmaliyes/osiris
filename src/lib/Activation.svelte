<script>
    import { push } from "svelte-spa-router";
    const handleButtonClick = async () => {
        console.log("Check Login Function");
        push("/login");
    };
</script>

<main>
    <div class="container-scroller">
        <div class="container-fluid page-body-wrapper full-page-wrapper">
            <div class="content-wrapper d-flex align-items-center auth">
                <div class="row flex-grow">
                    <div class="col-lg-6 mx-auto">
                        <div class="auth-form-light text-left p-5">
                            <div class="brand-logo">
                                <center>
                                    <!-- <img src="../images/icon.png" alt="logo"/> -->
                                    <h4>Activation</h4>
                                </center>
                            </div>
                            <a href="login.html" class="text-color">Back</a>
                            <form class="pt-3">
                                <div
                                    class="form-group d-flex justify-content-between"
                                >
                                    <input
                                        type="text"
                                        id="institution"
                                        placeholder="Institution Name"
                                        class="form-control"
                                    />
                                    <input
                                        type="text"
                                        id="head"
                                        placeholder="Head of Institution"
                                        class="form-control marginLeft"
                                    />
                                </div>
                                <div class="form-group d-flex">
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Email"
                                        class="form-control"
                                        aria-describedby="emailHelp"
                                    />
                                    <input
                                        type="number"
                                        id="phone"
                                        placeholder="Mobile No"
                                        class="form-control marginLeft"
                                    />
                                </div>
                                <div class="form-group d-flex">
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Password"
                                        class="form-control"
                                    />
                                    <input
                                        type="password"
                                        id="repassword"
                                        placeholder="Re enter Password"
                                        class="form-control marginLeft"
                                    />
                                </div>
                                <div class="form-group">
                                    <input
                                        type="text"
                                        id="code"
                                        placeholder="Product Key"
                                        class="form-control"
                                    />
                                </div>
                                <div class="mt-3">
                                    <button
                                        id="submit"
                                        type="button"
                                        class="btn btn-warning button-color w-100 font-weight-bold mt-2"
                                        on:click={handleButtonClick}
                                    >
                                        Activate
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
