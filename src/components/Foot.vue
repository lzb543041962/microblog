<template>
  <footer class="footer-wrapper">
    <el-menu class="el-menu-demo" mode="horizontal">
      <div id="footer-bottom-wrapper">
        <div id="footer-bottom" class="container">
            <div class="row">
                <div class="span12">
                    <p class="copyright">
                            Copyright © 2017. All Rights Reserved by Mistake.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </el-menu>
  </footer>
</template>

<script>
export default {
  name: 'footer-wrapper',
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p {
  color: #fff;
  text-align: center;
  font-size: 14px;
}
</style>
