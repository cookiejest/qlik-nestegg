<template>

  <parentwrapper>

<header-component>
</header-component>

<section>
<div class="columns">
  <div class="column is-one-quarter">    
    <div class="box">
    <aside class="nohighlight">
      <div class="box">


                    <button class="button is-large is-success" id="run_test_button">
                        <span>Run Test</span>
                        <span class="icon is-small">
                            <i class="fas fa-play"></i>
                        </span>


                    </button>

                    <button class="button is-large is-danger">
                           
                            <span class="icon is-small">
                                <i class="fas fa-stop"></i>
                            </span>
    
    
                        </button>
</div>

<test-list-component>
</test-list-component>
<test-new-form-component></test-new-form-component>
    </aside>
  </div>
</div>
  <div class="column">
        <div class="box">
    <section>
<section class="hero is-info">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        Test Editor
      </h1>
      <h2 class="subtitle">
        Test like a boss
      </h2>
    </div>
  </div>
</section>
<section>
<test-case-list-component></test-case-list-component>
</section>

<test-case-form-component></test-case-form-component>
    </section></div>
  </div>
</div>
</section>
  <footer class="footer">
    <div class="container">
      <div class="content has-text-centered">
        <p>
          <strong>Bulma</strong> by <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is licensed
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
          is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
        </p>
      </div>
    </div>
  </footer>
  </parentwrapper>
</template>

<script>
export default {
  name: "App"
};
</script>
<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #8c67ef;
$primary-invert: findColorInvert($primary);
$twitter: #4099ff;
$twitter-invert: findColorInvert($twitter);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
  "white": ($white, $black),
  "black": ($black, $white),
  "light": ($light, $light-invert),
  "dark": ($dark, $dark-invert),
  "primary": ($primary, $primary-invert),
  "info": ($info, $info-invert),
  "success": ($success, $success-invert),
  "warning": ($warning, $warning-invert),
  "danger": ($danger, $danger-invert),
  "twitter": ($twitter, $twitter-invert)
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
