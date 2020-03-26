<template>
  <div>
    <button :class="type == 1 ? 'button1':'button2'"><slot></slot></button>
  </div>
</template>

<script>
export default {
  props: {
    type: Number
  }
}
</script>

<style>

button {
  outline: none;
  border: none ;
  font-size: 16px;
  padding: 8px 20px;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.button1 {
  background: linear-gradient(to right, #ff9569 0%, #e92758 100%);
  margin-right: 20px;
}
.button1:hover {
  background: linear-gradient(to left, #ff9569 0%, #e92758 100%);
}
.button2 {
  background: linear-gradient(-90deg, #29bdd9 0%, #276ace 100%)
}
.button2:hover {
  background: linear-gradient(90deg, #29bdd9 0%, #276ace 100%)
}


</style>