<template>
  <div class="mx-5">
    <div class="">
      <h1 class="font-sans py-4">Plan a new vacation</h1>

      <form @submit.prevent="createVacation">
        <div class="mb-6 w-2/5">
          <label for="vacation_name" class="label">Vacation Name</label>
          <input
            type="text"
            id="vacation_name"
            class="input"
            autofocus
            autocomplete="off"
            placeholder="Name or comment for the vacation"
            v-model="newVacation.name"
          />
        </div>

        <div class="example w-2/5 ">
          <div>
            <datepicker
              class="w-64 pt-3 pb-5"
              placeholder="Select start date"
              v-model="newVacation.startDate"
            ></datepicker>

            <datepicker
              class="w-64 pt-3"
              placeholder="Select end date"
              v-model="newVacation.endDate"
            ></datepicker>
          </div>
        </div>

        <input
          type="submit"
          value="Add vacation"
          class="font-sans font-bold px-4 rounded cursor-pointer no-underline bg-green hover:bg-green-dark block w-2/5 py-4 text-white items-center justify-center"
        />
      </form>
    </div>

    <hr class="border border-grey-light my-6" />
    <h3>Your vacations:</h3>
    <ul class="list-reset mt-4">
      <li
        class="py-4"
        v-for="vacation in vacations"
        :key="vacation.id"
        :vacation="vacation"
      >
        <div class="flex items-center justify-between flex-wrap">
          <div class="flex-1 flex justify-between flex-wrap pr-4">
            <p class="block flex font-mono font-semibold flex items-center">
              <svg height="50" width="50">
                <circle
                  cx="20"
                  cy="23"
                  r="15"
                  stroke="lightblue"
                  stroke-width="6"
                  fill="transparent"
                />
                Sorry, your browser does not support inline SVG.
              </svg>
              {{ vacation.name }} &mdash;
              {{ getNiceDate(vacation.startDate) }} to
              {{ getNiceDate(vacation.endDate) }}
            </p>
          </div>

          <button
            class="bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded"
            @click.prevent="viewVacation(vacation)"
          >
            View
          </button>

          <button
            class="bg-transparent text-sm hover:bg-red text-red hover:text-white no-underline font-bold py-2 px-4 rounded border border-red"
            @click.prevent="removeVacation(vacation)"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker/dist/vuejs-datepicker.esm.js";
import router from "../router";

const state = {
  date1: new Date()
};

export default {
  name: "app",
  components: {
    Datepicker
  },
  data() {
    return {
      state: state,
      endDate: null,
      startDate: null,
      error: "",
      vacations: [],
      newVacation: []
    };
  },
  created() {
    if (!localStorage.signedIn) {
      this.$router.replace("/");
      console.log("Not signed in");
    } else {
      console.log("Signed in");

      this.$http.secured
        .get("/api/v1/vacations")
        .then(response => {
          this.vacations = response.data;
          console.log("Retreieved vacations:");

          console.log(this.vacations);
        })
        .catch(error => this.setError(error, "Couldnt get vacations"));
    }
  },
  mounted() {
    Vue.set();
  },
  methods: {
    setError(error, text) {
      this.error =
        (error.response && error.response.data && error.response.data.error) ||
        text;
      console.log("error: " + error + " - " + text);
    },
    getNiceDate(date) {
      var dateFormat = require("dateformat");
      return dateFormat(date, " mmm dS");
    },
    createVacation() {
      const value = this.newVacation;
      console.log("Creating new vacation:");

      if (!value) {
        console.log("this.newVacation is empty");
        return;
      }

      const diffTime = Math.abs(
        this.newVacation.endDate - this.newVacation.startDate
      );

      const day = 60 * 60 * 24 * 1000;

      const diffDays = Math.ceil(diffTime / day);

      var date = new Date(this.newVacation.startDate);

      var listOfDays = [];
      for (let i = 0; i <= diffDays; i++) {
        console.log("day: " + date);
        date = new Date(date.getTime() + day);
        var dayObject = {};
        dayObject["id"] = i;
        dayObject["date"] = date;
        dayObject["location"] = "";
        dayObject["comment"] = "";
        dayObject["activities"] = "";
        listOfDays.push(dayObject);
      }

      this.$http.secured
        .post("/api/v1/vacations/", {
          vacation: {
            name: this.newVacation.name,
            startDate: this.newVacation.startDate,
            endDate: this.newVacation.endDate,
            data: JSON.stringify(listOfDays)
          }
        })
        .then(response => {
          console.log("Vacation created");
          this.vacations.push(response.data);
          this.newVacation = [];
        })
        .catch(error => this.setError(error, "Cannot create vacation"));
    },
    removeVacation(vacation) {
      this.$http.secured
        .delete(`/api/v1/vacations/${vacation.id}`)
        .then(response => {
          this.vacations.splice(this.vacations.indexOf(vacation), 1);
        })
        .catch(error => this.setError(error, "Cannot delete vacation"));
    },
    viewVacation(vacation) {
      router.push({
        name: "VacationDisplay",
        params: {
          vacation: vacation
        }
      });
    }
  }
};
</script>

<style>
body {
  font-family: "Helvetica Neue Light", Helvetica, sans-serif;
  padding: 1em 2em 2em;
}
input,
select {
  padding: 0.75em 0.5em;
  font-size: 100%;
  border: 1px solid #ccc;
  width: 100%;
}

select {
  height: 2.5em;
}

.example {
  background: #f2f2f2;
  border: 1px solid #ddd;
  padding: 0em 1em 1em;
  margin-bottom: 2em;
}

code,
pre {
  margin: 1em 0;
  padding: 1em;
  border: 1px solid #bbb;
  display: block;
  background: #ddd;
  border-radius: 3px;
}

.settings {
  margin: 2em 0;
  border-top: 1px solid #bbb;
  background: #eee;
}

h5 {
  font-size: 100%;
  padding: 0;
}

.form-group {
  margin-bottom: 1em;
}

.form-group label {
  font-size: 80%;
  display: block;
}
</style>
