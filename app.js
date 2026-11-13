const API = "https://www.apicountries.com/countries";

async function buscarPais(nombre) {
  const respuesta = await fetch(API);

  if (!respuesta.ok) {
    throw new Error(`Error del servidor (código ${respuesta.status}).`);
  }

  const todos = await respuesta.json();
  const termino = nombre.toLowerCase().trim();

  // Filtra por nombre común, oficial o traducción en español
  const encontrados = todos.filter(pais => {
    const comun = (pais.name?.common || pais.name || "").toLowerCase();
    const oficial = (pais.name?.official || "").toLowerCase();
    const esp = (pais.translations?.spa?.common || pais.translations?.es || "").toLowerCase();
    return comun.includes(termino) || oficial.includes(termino) || esp.includes(termino);
  });

  if (encontrados.length === 0) {
    throw new Error("No se encontró ningún país con ese nombre.");
  }

  return encontrados;
}

function mostrarPaises(paises) {
  const contenedor = document.getElementById("resultados");
  contenedor.innerHTML = "";

  paises.forEach(pais => {
    const nombrePais = pais.name?.common || pais.name || "Sin nombre";
    const bandera = pais.flags?.png || pais.flag || "";
    const capital = Array.isArray(pais.capital) ? pais.capital[0] : (pais.capital || "Sin capital");

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML = `
      <img src="${bandera}" alt="Bandera de ${nombrePais}">
      <h3>${nombrePais}</h3>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Región:</b> ${pais.region || "N/A"}</p>
      <p><b>Población:</b> ${(pais.population || 0).toLocaleString("es-MX")}</p>
    `;
    contenedor.appendChild(tarjeta);
  });
}

const form = document.getElementById("formBuscar");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("txtPais").value.trim();
  mensaje.textContent = "Cargando...";

  try {
    const paises = await buscarPais(nombre);
    mostrarPaises(paises);
    mensaje.textContent = `${paises.length} resultado(s)`;
  } catch (error) {
    document.getElementById("resultados").innerHTML = "";
    mensaje.textContent = error.message;
  }
});