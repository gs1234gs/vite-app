import { configureStore } from "@reduxjs/toolkit";
import breader from "@/stores/reduxs/bread";

const store = configureStore({
  reducer: {
    breader:breader
  },
});

export default store;