<template>
  <footer>
    <div class="footer-content">
      <div class="validators">
        <a href="https://validator.w3.org/nu/?doc=https://coloc.valentinraillard.fr/login" target="_blank">HTML Validation</a>
        <a href="https://jigsaw.w3.org/css-validator/validator?uri=https://coloc.valentinraillard.fr/login" target="_blank">CSS Validation</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: #0e1419;
  color: white;
  padding: 15px;
  text-align: center;
  margin-top: auto;
}

.validators {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.validators a {
  color: var(--accent-color);
  text-decoration: underline;
}

</style>
<script setup lang="ts">
</script>