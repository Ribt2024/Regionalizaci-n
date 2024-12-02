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
    
    // Calcular el Gran Total
    const grandTotal = totalPropios + totalSGP;

    // Obtener la nueva celda donde mostrar el Gran Total
    const grandTotalCell = document.getElementById("grandTotalCell");

    // Asignar el Gran Total a esa celda
    grandTotalCell.textContent = formatNumber(grandTotal);
          
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


document.getElementById("generateReport").addEventListener("click", () => {
  const tableBody = document.querySelector("#budgetTable tbody");
  const reportSection = document.getElementById("reportSection");

  if (!tableBody) {
      console.error("No se encontró la tabla con el ID 'budgetTable'");
      return;
  }

  // Limpiar cualquier informe generado previamente
  reportSection.innerHTML = "";

  const rows = Array.from(tableBody.rows); // Obtener todas las filas de la tabla original

  // Función para limpiar separadores de miles y convertir a número
  const cleanNumber = (value) => {
      return parseFloat(value.replace(/,/g, '') || 0);
  };

  // Función para formatear números con separadores de miles
  const formatNumber = (value) => {
      return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  rows.forEach((row, index) => {
      const reportTableContainer = document.createElement("div");
      reportTableContainer.classList.add("report-container");

      // Agregar el título de la tabla
      const tableTitle = document.createElement("h3");
      tableTitle.textContent = `Producto ${index + 1}`;
      reportTableContainer.appendChild(tableTitle);

      const reportTable = document.createElement("table");
      reportTable.classList.add("report-table");

      // Crear encabezado de la nueva tabla
      const headerRow = document.createElement("tr");
      ["AÑO", "PROPIO", "SGP", "TOTALES"].forEach(headerText => {
          const headerCell = document.createElement("th");
          headerCell.textContent = headerText;
          headerRow.appendChild(headerCell);
      });
      reportTable.appendChild(headerRow);

      // Crear filas de datos
      const years = ["2024", "2025", "2026", "2027"];
      let totalPropio = 0;
      let totalSGP = 0;
      let totalTotales = 0;

      years.forEach((year, yearIndex) => {
          const dataRow = document.createElement("tr");

          // Columna "AÑO"
          const yearCell = document.createElement("td");
          yearCell.textContent = year;
          dataRow.appendChild(yearCell);

          // Columnas "PROPIO" y "SGP"
          const propioInput = row.querySelectorAll("input")[yearIndex * 2]; // PROPIO
          const sgpInput = row.querySelectorAll("input")[yearIndex * 2 + 1]; // SGP

          const propioValue = cleanNumber(propioInput?.value);
          const sgpValue = cleanNumber(sgpInput?.value);

          const propioCell = document.createElement("td");
          propioCell.textContent = formatNumber(propioValue);
          dataRow.appendChild(propioCell);

          const sgpCell = document.createElement("td");
          sgpCell.textContent = formatNumber(sgpValue);
          dataRow.appendChild(sgpCell);

          // Columna "TOTALES" (negrita)
          const totalValue = propioValue + sgpValue;

          const totalCell = document.createElement("td");
          totalCell.textContent = formatNumber(totalValue);
          totalCell.style.fontWeight = "bold";  // Aplicar negrita a la celda de total
          dataRow.appendChild(totalCell);

          // Sumar los valores a los totales por columna
          totalPropio += propioValue;
          totalSGP += sgpValue;
          totalTotales += totalValue;

          reportTable.appendChild(dataRow);
      });

      // Crear fila de totales por columna (PROPIO, SGP, TOTALES) (negrita)
      const columnTotalsRow = document.createElement("tr");
      const columnTotalsLabelCell = document.createElement("td");
      columnTotalsLabelCell.textContent = "TOTAL FUENTE";
      columnTotalsLabelCell.colSpan = 1;
      columnTotalsLabelCell.style.fontWeight = "bold"; // Negrita en la celda de la etiqueta
      columnTotalsRow.appendChild(columnTotalsLabelCell);

      // Sumar los totales de las columnas
      const totalPropioCell = document.createElement("td");
      totalPropioCell.textContent = formatNumber(totalPropio);
      totalPropioCell.style.fontWeight = "bold"; // Negrita
      columnTotalsRow.appendChild(totalPropioCell);

      const totalSGPCell = document.createElement("td");
      totalSGPCell.textContent = formatNumber(totalSGP);
      totalSGPCell.style.fontWeight = "bold"; // Negrita
      columnTotalsRow.appendChild(totalSGPCell);

      const totalTotalesCell = document.createElement("td");
      totalTotalesCell.textContent = formatNumber(totalTotales);
      totalTotalesCell.style.fontWeight = "bold"; // Negrita
      columnTotalsRow.appendChild(totalTotalesCell);

      reportTable.appendChild(columnTotalsRow);

      // Añadir la tabla generada al contenedor
      reportTableContainer.appendChild(reportTable);

      // Agregar la tabla al reporte final
      reportSection.appendChild(reportTableContainer);
  });
});
