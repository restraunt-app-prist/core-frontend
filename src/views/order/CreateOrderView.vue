<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CreateOrderCartContentStepView from "@/views/order/steps/CreateOrderCartContentStepView.vue";
import CreateOrderDeliveryStepView from "@/views/order/steps/CreateOrderDeliveryStepView.vue";
import CreateOrderPaymentStepView from "@/views/order/steps/CreateOrderPaymentStepView.vue";


const router = useRouter();

let step = ref(1);
let steps = ['Cart content', 'Delivery', 'Payment'];

const getPrevStepperButtonText = () => {
  if (step.value === 1) {
    return "Back to cart";
  }
  return "Next";
}

const getNextStepperButtonText = () => {
  if (step.value >= 1 && step.value <= steps.length-1) {
    return "Next"
  }
  return "Make order"
}

const onStepperNextClick = () => {
  if (step.value + 1 <= steps.length) {
    step.value ++;
  } else {
    alert("MAKE order!")
  }
}

const onStepperPrevClick = () => {
  if (step.value - 1 >= 1) {
    step.value --;
  } else {
    router.push("/cart");
  }
}

</script>

<template>
    <v-stepper :items="steps" v-model="step" hide-actions >
      <template v-slot:item.1>
        <CreateOrderCartContentStepView/>
      </template>

      <template v-slot:item.2>
        <CreateOrderDeliveryStepView/>
      </template>

      <template v-slot:item.3>
        <CreateOrderPaymentStepView/>
      </template>

      <v-stepper-actions
          :disabled="false"
          :next-text="getNextStepperButtonText()"
          :prev-text="getPrevStepperButtonText()"
          @click:next="onStepperNextClick()"
          @click:prev="onStepperPrevClick()"
      ></v-stepper-actions>

    </v-stepper>
</template>

<style scoped>

</style>
