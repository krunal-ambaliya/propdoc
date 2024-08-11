const svgNS = "http://www.w3.org/2000/svg";

    function drawPieChart(elementId, data) {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      let currentAngle = -0.5 * Math.PI;
      const radius = 100;

      const chart = document.createElementNS(svgNS, "svg");
      chart.setAttribute("viewBox", "0 0 200 200");
      chart.setAttribute("preserveAspectRatio", "xMidYMid meet");
      chart.setAttribute("width", "100%");
      chart.setAttribute("height", "100%");

      data.forEach((item) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        const x1 = 100 + radius * Math.cos(currentAngle);
        const y1 = 100 + radius * Math.sin(currentAngle);
        const x2 = 100 + radius * Math.cos(currentAngle + sliceAngle);
        const y2 = 100 + radius * Math.sin(currentAngle + sliceAngle);

        const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

        const pathData = [
          `M 100 100`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          `Z`
        ].join(" ");

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", item.color);

        chart.appendChild(path);

        currentAngle += sliceAngle;
      });

      document.getElementById(elementId).appendChild(chart);
    }

    function createLabels(containerId, data) {
      const container = document.getElementById(containerId);
      data.forEach((item) => {
        const labelItem = document.createElement("div");
        labelItem.className = "label-item";

        const colorBox = document.createElement("span");
        colorBox.className = "label-color";
        colorBox.style.backgroundColor = item.color;

        const text = document.createElement("span");
        text.textContent = `${item.label} : ${item.value}`;

        labelItem.appendChild(colorBox);
        labelItem.appendChild(text);
        container.appendChild(labelItem);
      });
    }
// for admin 
    const jobsData = [
      { label: 'Total Jobs(a)', value: 100, color: '#4154F1' },
      { label: 'Pending Quote', value: 10, color: '#FFD0C3' },
      { label: 'Schedule', value: 20, color: '#87EFAC' }
    ];
    const tradersData = [
      { label: 'Total Traders', value: 100, color: '#4154F1' },
      { label: 'Gas Compliance', value: 10, color: '#FFD0C3' },
      { label: 'Cleaning', value: 20, color: '#87EFAC' }
    ];

// for trader
    const jobsData3 = [
      { label: 'Pending Quote1', value: 40, color: '#8E4BA0' },
      { label: 'Schedule', value: 30, color: '#00A2E1' },
      { label: 'Pending Quote2', value: 20, color: '#00B282' },
         
      { label: 'Pending Quote3', value: 10, color: '#FFCC15 ' },
      { label: 'Total Jobs(t)', value: 10, color: '#FC4D4C' }
      
     
  
    ];
    const tradersData3 = [
      { label: 'Total Traders', value: 100, color: '#4154F1' },
      { label: 'Gas Compliance', value: 10, color: '#FFD0C3' },
      { label: 'Cleaning', value: 20, color: '#87EFAC' }
    ];

    // for agent
    const jobsData6 = [
      { label: 'Pending Quote1', value: 40, color: '#8E4BA0' },
      { label: 'Schedule', value: 30, color: '#00A2E1' },
      { label: 'Pending Quote2', value: 20, color: '#00B282' },
         
      { label: 'Pending Quote3', value: 10, color: '#FFCC15 ' },
      { label: 'Total Jobs(t)', value: 10, color: '#FC4D4C' }
      
     
  
    ];
    const tradersData6 = [
      { label: 'Total Traders', value: 100, color: '#4154F1' },
      { label: 'Gas Compliance', value: 10, color: '#FFD0C3' },
      { label: 'Cleaning', value: 20, color: '#87EFAC' }
    ];