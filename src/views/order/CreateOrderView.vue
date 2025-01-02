<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import CreateOrderCartContentStepView from "@/views/order/steps/CreateOrderCartContentStepView.vue";
import CreateOrderDeliveryStepView from "@/views/order/steps/CreateOrderDeliveryStepView.vue";
import CreateOrderPaymentStepView from "@/views/order/steps/CreateOrderPaymentStepView.vue";
import {createCheckoutSession, loadStripeScript} from "@/service/payment.js";
import {makeOrder} from "@/service/order.js";

const router = useRouter();

const deliveryNeeded = ref(false);
const deliveryDistance = ref(0);
const userLocation = ref(null);

const step = ref(1);
const steps = ['Cart content', 'Delivery', 'Payment'];

const handleDeliveryNeeded = (isDeliveryNeeded, distance, location) => {
  deliveryNeeded.value = isDeliveryNeeded;
  deliveryDistance.value = distance;
  userLocation.value = location;
};

const getPrevStepperButtonText = () => {
  if (step.value === 1) {
    return "Back to cart";
  }
  return "Prev";
}

const getNextStepperButtonText = () => {
  if (step.value >= 1 && step.value <= steps.length - 1) {
    return "Next"
  }
  return "Make order"
}

const onStepperNextClick = async () => {
  if (step.value + 1 <= steps.length) {
    step.value++;
  } else {
    const {id, totalPrice} = await makeOrder(JSON.stringify(userLocation.value), deliveryDistance.value, "some description of order");
    await createCheckoutSession(id, totalPrice);
  }
}

const onStepperPrevClick = () => {
  if (step.value - 1 >= 1) {
    step.value--;
  } else {
    router.push("/cart");
  }
}

onMounted(() => loadStripeScript());

</script>

<template>
  <v-stepper :items="steps" v-model="step" hide-actions>
    <template v-slot:item.1>
      <CreateOrderCartContentStepView/>
    </template>

    <template v-slot:item.2>
      <CreateOrderDeliveryStepView @deliveryNeeded="handleDeliveryNeeded"/>
    </template>

    <template v-slot:item.3>
      <CreateOrderPaymentStepView :deliveryNeeded="deliveryNeeded" :deliveryDistance="deliveryDistance"/>
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
