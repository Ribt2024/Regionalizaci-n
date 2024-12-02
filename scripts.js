document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#budgetTable tbody");
    const totalPropiosCell = document.getElementById("totalPropios");
    const totalSGPCell = document.getElementById("totalSGP");
  
    const totalColumnIds = [
      "total2024Propio", "total2024SGP",
      "total2025Propio", "total2025SGP",
      "total2026Propio", "total2026SGP",
      "total2027Propio", "total2027SGP"
    ];
  
    const parseNumber = (formattedString) => {
      return parseFloat(formattedString.replace(/[^0-9.-]+/g, "")) || 0;
    };
  
    const formatNumber = (number) => {
      return number.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
  
    const addRow = () => {
      const row = document.createElement("tr");
  
      // Product cell
      const productCell = document.createElement("td");
      productCell.textContent = `P${tableBody.rows.length + 1}`;
      row.appendChild(productCell);
  
      // Create input cells for each year and category
      for (let i = 0; i < 8; i++) {
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.classList.add("currency");
  
        // Eventos para formatear y calcular
        input.addEventListener("blur", () => {
          formatCurrency(input);
          updateRowTotals(row);
          updateTableTotals();
        });
  
        // Evento para moverse con Enter
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            moveFocus(input);
          }
        });
  
        cell.appendChild(input);
        row.appendChild(cell);
      }
  
      // Totals for the row
      const propiosCell = document.createElement("td");
      propiosCell.classList.add("row-total-propios");
      propiosCell.textContent = "0.00";
      row.appendChild(propiosCell);
  
      const sgpCell = document.createElement("td");
      sgpCell.classList.add("row-total-sgp");
      sgpCell.textContent = "0.00";
      row.appendChild(sgpCell);
  
      // Delete button
      const deleteCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.addEventListener("click", () => {
        row.remove();
        updateTableTotals();
      });
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);
  
      tableBody.appendChild(row);
    };
  
    const moveFocus = (currentInput) => {
      const cell = currentInput.parentElement;
      const row = cell.parentElement;
      const inputsInRow = row.querySelectorAll("input");
      const columnIndex = Array.from(row.children).indexOf(cell);
      const nextRow = row.nextElementSibling;
  
      if (nextRow) {
        // Si hay una fila siguiente, moverse hacia abajo en la misma columna
        const nextInput = nextRow.children[columnIndex].querySelector("input");
        if (nextInput) nextInput.focus();
      } else {
        // Si no hay más filas, moverse a la derecha
        const inputsInTable = tableBody.querySelectorAll("input");
        const currentIndex = Array.from(inputsInTable).indexOf(currentInput);
        const nextInput = inputsInTable[currentIndex + 1];
        if (nextInput) nextInput.focus();
      }
    };
  
    const updateRowTotals = (row) => {
      const inputs = row.querySelectorAll("input");
      let propiosSum = 0;
      let sgpSum = 0;
  
      inputs.forEach((input, index) => {
        const value = parseNumber(input.value);
        if (index % 2 === 0) {
          propiosSum += value; // Sum PROPIO values
        } else {
          sgpSum += value; // Sum SGP values
        }
      });
  
      row.querySelector(".row-total-propios").textContent = formatNumber(propiosSum);
      row.querySelector(".row-total-sgp").textContent = formatNumber(sgpSum);
    };
  
    const updateTableTotals = () => {
      const columnTotals = Array(8).fill(0);
      let totalPropios = 0;
      let totalSGP = 0;
  
      Array.from(tableBody.rows).forEach((row) => {
        const inputs = row.querySelectorAll("input");
        inputs.forEach((input, index) => {
          columnTotals[index] += parseNumber(input.value);
        });
  
        totalPropios += parseNumber(row.querySelector(".row-total-propios").textContent);
        totalSGP += parseNumber(row.querySelector(".row-total-sgp").textContent);
      });
  
      columnTotals.forEach((total, index) => {
        document.getElementById(totalColumnIds[index]).textContent = formatNumber(total);
      });
  
      totalPropiosCell.textContent = formatNumber(totalPropios);
      totalSGPCell.textContent = formatNumber(totalSGP);
    };
  
    document.getElementById("addRow").addEventListener("click", addRow);
    document.getElementById("resetTable").addEventListener("click", () => {
      tableBody.innerHTML = "";
      updateTableTotals();
    });
  });
  
  function formatCurrency(input) {
    let rawValue = input.value.replace(/[^0-9.]/g, "");
    let value = parseFloat(rawValue);
    input.value = !isNaN(value) ? value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";
  }
  