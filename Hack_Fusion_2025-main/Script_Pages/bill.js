 // Tab switching
 function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabName + '-tab').style.display = 'block';
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Update charts when analytics tab is shown
    if (tabName === 'analytics') {
        updateCharts();
    }
}

// Form submission
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your feedback! Your input will be processed and sent to the legislative committee.');
    this.reset();
});

// Download bill function
function downloadBill() {
    // In a real implementation, this would link to an actual PDF
    alert('Downloading HB-1234: Education Reform Act.pdf\n(Note: This is a demo. In a real implementation, this would download the actual bill PDF.)');
    // window.location.href = 'path/to/HB-1234.pdf';
}

// Initialize charts
function updateCharts() {
    const ctx = document.getElementById('feedbackChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
            datasets: [
                {
                    label: 'Support',
                    data: [85, 42, 76, 58],
                    backgroundColor: '#2ecc71',
                },
                {
                    label: 'Oppose',
                    data: [12, 35, 18, 22],
                    backgroundColor: '#e74c3c',
                },
                {
                    label: 'Suggest Edit',
                    data: [8, 28, 11, 15],
                    backgroundColor: '#e67e22',
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Feedback on HB-1234 by Section'
                },
            },
            scales: {
                x: {
                    stacked: false,
                },
                y: {
                    stacked: false,
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // You could load real data here from a JSON file if needed
});