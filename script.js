const start = document.getElementById('start');
            const end = document.getElementById('end');

            start.addEventListener('change', () => {
                end.min = start.value;
            });

            end.addEventListener('change', () => {
                start.max = end.value;
            });