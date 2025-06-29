  // Calendar functionality
  const currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let selectedDate = null;
  let selectedTime = '9:40am';

  const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function generateCalendar(month, year) {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert to Monday = 0

      const calendarGrid = document.getElementById('calendarGrid');
      const calendarTitle = document.getElementById('calendarTitle');
      
      calendarTitle.textContent = `${months[month]} ${year}`;
      
      // Clear existing days
      const existingDays = calendarGrid.querySelectorAll('.calendar-day');
      existingDays.forEach(day => day.remove());

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDayOfWeek; i++) {
          const emptyDay = document.createElement('div');
          emptyDay.className = 'calendar-day';
          calendarGrid.appendChild(emptyDay);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
          const dayElement = document.createElement('div');
          dayElement.className = 'calendar-day';
          dayElement.textContent = day;
          
          // Check if it's today
          const today = new Date();
          if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
              dayElement.classList.add('today');
          }

          // Check if it's the selected date (26th in the example)
          if (day === 26) {
              dayElement.classList.add('selected');
              selectedDate = new Date(year, month, day);
          }

          dayElement.addEventListener('click', function() {
              // Remove previous selection
              const prevSelected = calendarGrid.querySelector('.calendar-day.selected');
              if (prevSelected) {
                  prevSelected.classList.remove('selected');
              }
              
              // Add selection to clicked day
              dayElement.classList.add('selected');
              selectedDate = new Date(year, month, day);
          });

          calendarGrid.appendChild(dayElement);
      }
  }

  // Time slot functionality
  const timeSlots = document.querySelectorAll('.time-slot');
  timeSlots.forEach(slot => {
      slot.addEventListener('click', function() {
          // Remove previous selection
          const prevSelected = document.querySelector('.time-slot.selected');
          if (prevSelected) {
              prevSelected.classList.remove('selected');
          }
          
          // Add selection to clicked slot
          slot.classList.add('selected');
          selectedTime = slot.dataset.time;
      });
  });

  // Navigation functionality
  document.getElementById('prevMonth').addEventListener('click', function() {
      currentMonth--;
      if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
      }
      generateCalendar(currentMonth, currentYear);
  });

  document.getElementById('nextMonth').addEventListener('click', function() {
      currentMonth++;
      if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
      }
      generateCalendar(currentMonth, currentYear);
  });

  // Complete booking functionality
  document.getElementById('completeBooking').addEventListener('click', function() {
      const formData = new FormData(document.getElementById('bookingForm'));
      const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
          .map(checkbox => checkbox.value);
      
      console.log('Booking Details:', {
          fullName: formData.get('fullName') || document.getElementById('fullName').value,
          email: formData.get('email') || document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          company: document.getElementById('company').value,
          services: selectedServices,
          budget: document.getElementById('budget').value,
          questions: document.getElementById('questions').value,
          selectedDate: selectedDate,
          selectedTime: selectedTime
      });
      
      alert('Booking completed successfully!');
  });

  // Initialize calendar
  generateCalendar(currentMonth, currentYear);