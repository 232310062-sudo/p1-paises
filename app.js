const API = "https://www.apicountries.com/countries";

const RESPALDO_PAISES = [
  { name: { common: "Mexico", official: "United Mexican States" }, translations: { spa: { common: "México" } }, capital: ["Mexico City"], region: "Americas", population: 128932753, flags: { png: "https://flagcdn.com/w320/mx.png" } },
  { name: { common: "Brazil", official: "Federative Republic of Brazil" }, translations: { spa: { common: "Brasil" } }, capital: ["Brasília"], region: "Americas", population: 212559417, flags: { png: "https://flagcdn.com/w320/br.png" } },
  { name: { common: "Canada", official: "Canada" }, translations: { spa: { common: "Canadá" } }, capital: ["Ottawa"], region: "Americas", population: 38005238, flags: { png: "https://flagcdn.com/w320/ca.png" } },
  { name: { common: "China", official: "People's Republic of China" }, translations: { spa: { common: "China" } }, capital: ["Beijing"], region: "Asia", population: 1402112000, flags: { png: "https://flagcdn.com/w320/cn.png" } },
  { name: { common: "Colombia", official: "Republic of Colombia" }, translations: { spa: { common: "Colombia" } }, capital: ["Bogotá"], region: "Americas", population: 50882891, flags: { png: "https://flagcdn.com/w320/co.png" } },
  { name: { common: "Japan", official: "Japan" }, translations: { spa: { common: "Japón" } }, capital: ["Tokyo"], region: "Asia", population: 125836021, flags: { png: "https://flagcdn.com/w320/jp.png" } },
  { name: { common: "Spain", official: "Kingdom of Spain" }, translations: { spa: { common: "España" } }, capital: ["Madrid"], region: "Europe", population: 47351567, flags: { png: "https://flagcdn.com/w320/es.png" } },
  { name: { common: "United States", official: "United States of America" }, translations: { spa: { common: "Estados Unidos" } }, capital: ["Washington, D.C."], region: "Americas", population: 329484123, flags: { png: "https://flagcdn.com/w320/us.png" } },
  { name: { common: "Argentina", official: "Argentine Republic" }, translations: { spa: { common: "Argentina" } }, capital: ["Buenos Aires"], region: "Americas", population: 45376763, flags: { png: "https://flagcdn.com/w320/ar.png" } },
  { name: { common: "Germany", official: "Federal Republic of Germany" }, translations: { spa: { common: "Alemania" } }, capital: ["Berlin"], region: "Europe", population: 83240525, flags: { png: "https://flagcdn.com/w320/de.png" } },
  { name: { common: "France", official: "French Republic" }, translations: { spa: { common: "Francia" } }, capital: ["Paris"], region: "Europe", population: 67391582, flags: { png: "https://flagcdn.com/w320/fr.png" } },
  { name: { common: "Italy", official: "Italian Republic" }, translations: { spa: { common: "Italia" } }, capital: ["Rome"], region: "Europe", population: 59554023, flags: { png: "https://flagcdn.com/w320/it.png" } },
  { name: { common: "Peru", official: "Republic of Peru" }, translations: { spa: { common: "Perú" } }, capital: ["Lima"], region: "Americas", population: 32971846, flags: { png: "https://flagcdn.com/w320/pe.png" } },
  { name: { common: "Chile", official: "Republic of Chile" }, translations: { spa: { common: "Chile" } }, capital: ["Santiago"], region: "Americas", population: 19116209, flags: { png: "https://flagcdn.com/w320/cl.png" } }
];

async function buscarPais(nombre) {
  if (!navigator.onLine) {
    throw new Error("Sin conexión a internet (Offline).");
  }

  let todos;
  try {
    const respuesta = await fetch(API);
    if (!respuesta.ok) throw new Error("Error HTTP");
    todos = await respuesta.json();
  } catch (e) {
    // Si CORS o la red bloquean el dominio en GitHub Pages, usa el respaldo automático
    todos = RESPALDO_PAISES;
  }

  const limpiar = txt => txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const termino = limpiar(nombre);

  const encontrados = todos.filter(pais => {
    const comun = limpiar(pais.name?.common || pais.name || "");
    const oficial = limpiar(pais.name?.official || "");
    const esp = limpiar(pais.translations?.spa?.common || pais.translations?.es || "");
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
