const button = document.querySelector("#button");
const calculateAge = (date) => {
  const currentDate = new Date();
  const dob = new Date(date);
  const currentYear = currentDate.getFullYear();
  const dobYear = dob.getFullYear();
  let age = 0;
  const currentMonth = currentDate.getMonth();
  const dobMonth = dob.getMonth();
  if (dobMonth > currentMonth) {
    age = currentYear - dobYear - 1;
  } else {
    age = currentYear - dobYear;
  }
  return age;
};
button.addEventListener("click", () => {
  const dob = document.getElementById("date").value;
  if (!dob) {
    console.error("Please select a date");
    return;
  }

  const age = calculateAge(dob);
  const result = document.getElementById("age-result");
  result.innerHTML = `${age}`;
});
