const lucenaBarangays = [
  "Barangay 1 (Poblacion)", "Barangay 2 (Poblacion)", "Barangay 3 (Poblacion)",
  "Barangay 4 (Poblacion)", "Barangay 5 (Poblacion)", "Barangay 6 (Poblacion)",
  "Barangay 7 (Poblacion)", "Barangay 8 (Poblacion)", "Barangay 9 (Poblacion)",
  "Barangay 10 (Poblacion)", "Barangay 11 (Poblacion)", "Barangay 12 (Poblacion)",
  "Barangay Bocaque", "Barangay Cotta", "Barangay Dalahican",
  "Barangay Domoit", "Barangay Ibabang Dupay", "Barangay Ibabang Iyam",
  "Barangay Ibabang Talim", "Barangay Ilayang Dupay", "Barangay Ilayang Iyam",
  "Barangay Ilayang Talim", "Barangay Gulang-gulang", "Barangay Mayao Castillo",
  "Barangay Mayao Crossing", "Barangay Mayao Kanluran", "Barangay Mayao Parada",
  "Barangay Mayao Silangan", "Barangay Ransohan", "Barangay Salinas",
  "Barangay Talao-talao", "Barangay Market View", "Barangay Silangang Mayao",
];

const lucenaStreetsByBarangay = {
  "Barangay 1 (Poblacion)":    ["Rizal Avenue", "Quezon Avenue", "Mabini Street", "Merchan Street"],
  "Barangay 2 (Poblacion)":    ["Quezon Avenue", "Granja Street", "Merchan Street", "Enriquez Street"],
  "Barangay 3 (Poblacion)":    ["Granja Street", "Alonzo Street", "Zulueta Street", "Gualberto Street"],
  "Barangay 4 (Poblacion)":    ["P. Gomez Street", "Lopez Jaena Street", "Araneta Street", "Natividad Street"],
  "Barangay 5 (Poblacion)":    ["Mabini Street", "Fernandez Street", "Velilla Street", "Castillo Street"],
  "Barangay 6 (Poblacion)":    ["M. L. Tagarao Street", "Capulong Street", "Ylagan Street", "Hernandez Street"],
  "Barangay 7 (Poblacion)":    ["Rizal Avenue", "P. Gomez Street", "Villaverde Street", "Rosario Street"],
  "Barangay 8 (Poblacion)":    ["Quezon Avenue", "Santiago Street", "P. Prieto Street", "D. Recto Avenue"],
  "Barangay 9 (Poblacion)":    ["Lopez Jaena Street", "Don Luis Hidalgo Street", "A. P. Garcia Street", "Luna Street"],
  "Barangay 10 (Poblacion)":   ["Diversion Road", "Heneral Tria Street", "Enriquez Street", "Alonzo Street"],
  "Barangay 11 (Poblacion)":   ["Diversion Road", "M. L. Tagarao Street", "Zulueta Street", "Gualberto Street"],
  "Barangay 12 (Poblacion)":   ["Rizal Avenue", "Granja Street", "Merchan Street", "Araneta Street"],
  "Barangay Bocaque":          ["Diversion Road", "Capulong Street"],
  "Barangay Cotta":            ["Dalahican Road", "Cotta Road", "Rizal Avenue Extension"],
  "Barangay Dalahican":        ["Dalahican Road", "Rizal Avenue Extension", "Diversion Road"],
  "Barangay Domoit":           ["Domoit Road", "Diversion Road"],
  "Barangay Ibabang Dupay":    ["Dupay Road", "Ibabang Dupay Street"],
  "Barangay Ibabang Iyam":     ["Iyam Road", "Diversion Road"],
  "Barangay Ibabang Talim":    ["Talim Road"],
  "Barangay Ilayang Dupay":    ["Ilayang Dupay Street"],
  "Barangay Ilayang Iyam":     ["Iyam Road", "Ilayang Iyam Street"],
  "Barangay Ilayang Talim":    ["Talim Road"],
  "Barangay Gulang-gulang":    ["Gulang-gulang Road", "Diversion Road"],
  "Barangay Mayao Castillo":   ["Mayao Road"],
  "Barangay Mayao Crossing":   ["Mayao Road"],
  "Barangay Mayao Kanluran":   ["Mayao Road"],
  "Barangay Mayao Parada":     ["Mayao Road"],
  "Barangay Mayao Silangan":   ["Mayao Road"],
  "Barangay Ransohan":         ["Ransohan Road"],
  "Barangay Salinas":          ["Salinas Road"],
  "Barangay Talao-talao":      ["Talao-talao Road"],
  "Barangay Market View":      ["Market View Road", "Granja Street"],
  "Barangay Silangang Mayao":  ["Mayao Road", "Silangang Mayao Street"],
};

const purokList = [
  "Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5",
  "Purok 6", "Purok 7", "Purok 8", "Purok 9", "Purok 10",
  "Purok 11", "Purok 12", "Purok 13", "Purok 14", "Purok 15",
  "Purok 16", "Purok 17", "Purok 18", "Purok 19", "Purok 20",
];

const lucenaStreets = [...new Set(Object.values(lucenaStreetsByBarangay).flat())];

export { lucenaBarangays, lucenaStreetsByBarangay, lucenaStreets, purokList };
