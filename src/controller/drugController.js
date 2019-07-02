const axios = require("axios");
var sanitizeHtml = require("sanitize-html");
module.exports.getCommonDrugs = (req, res) => {
  const baseUrl = "https://healthtools.aarp.org";
  const drugResponse = [];
  let resolved = 0;
  axios.default
    .get(`${baseUrl}/drug-directory?out=json`)
    .then(response => {
      let topDrugs = response.data.topRxDrugs;
      let drugsArray = [];
      for (let [drug, route] of Object.entries(topDrugs)) {
        drugsArray.push({
          drug,
          route
        });
      }
      for (const drug of drugsArray) {
        const callUrl = drug.route.includes("?")
          ? `${baseUrl}${drug.route}&out=json`
          : `${baseUrl}${drug.route}?out=json`;
        axios.default
          .get(callUrl)
          .then(response => {
            resolved++;
            const json = response.data;
            const genericName = json.genericName;
            const subSections = json.subSections;
            let imageUrl = "";
            let brandName = "";
            let dose = "";
            if (
              !(
                Object.entries(json.imageGroupMap).length === 0 &&
                json.imageGroupMap.constructor === Object
              )
            ) {
              imageUrl =
                json.imageGroupMap[Object.keys(json.imageGroupMap)[0]]
                  .pillImages[0].fullImagePath;
              brandName =
                json.imageGroupMap[Object.keys(json.imageGroupMap)[0]]
                  .pillImages[0].brandName;
              dose =
                json.imageGroupMap[Object.keys(json.imageGroupMap)[0]]
                  .pillImages[0].dosage;
            }
            const sections = [];
            for (const [index, object] of Object.entries(subSections)) {
              sections.push(object);
            }
            sections.forEach(section => {
              section.title = section.title
                .replace(/<[^>]+>/g, "")
                .replace(/\n/g, "");
            });
            imageUrl = `${baseUrl}/images/${imageUrl}`;
            const headerSummary = json.headerSummary;

            if (brandName.length > 0) {
              drugResponse.push({
                brandName,
                genericName,
                imageUrl,
                dose,
                // sections,
                summary: headerSummary
              });
            }

            if (resolved == drugsArray.length) {
              return drugResponse;
            }
          })
          .then(drugResponse => {
            if (drugResponse) {
              return res.send({ drugs: drugResponse });
            }
          })
          .catch(_ => res.status(500).send({ error: _ }));
      }
    })
    .catch(_ => res.status(500).send({ error: _ }));
};
const baseUrl = "https://healthtools.aarp.org";
module.exports.getDrug = (req, res) => {
  const genericName = req.params.genericName;
  const callUrl = `https://healthtools.aarp.org/goldcontent/${genericName}?out=json`;
  axios.default
    .get(callUrl)
    .then(response => {
      const json = response.data;
      const genericName = json.genericName;
      const subSections = json.subSections;
      let dose = "";
      let imageUrl = "";
      let brandName = "";
      if (
        !(
          Object.entries(json.imageGroupMap).length === 0 &&
          json.imageGroupMap.constructor === Object
        )
      ) {
        imageUrl =
          json.imageGroupMap[Object.keys(json.imageGroupMap)[0]].pillImages[0]
            .fullImagePath;
        brandName =
          json.imageGroupMap[Object.keys(json.imageGroupMap)[0]].pillImages[0]
            .brandName;
        dose =
          json.imageGroupMap[Object.keys(json.imageGroupMap)[0]].pillImages[0]
            .dosage;
      }
      const sections = [];
      for (const [index, object] of Object.entries(subSections)) {
        sections.push(object);
      }
      sections.forEach(section => {
        section.title = section.title
          .replace(/<[^>]+>/g, "")
          .replace(/\n/g, "");
        section.content = sanitizeHtml(section.content).replace(/\n/g, "");
      });
      imageUrl = `${baseUrl}/images/${imageUrl}`;
      const headerSummary = json.headerSummary;

      if (brandName.length > 0) {
        return {
          brandName,
          genericName,
          imageUrl,
          dose,
          summary: headerSummary,
          sections
        };
      }
    })
    .then(drugResponse => {
      if (drugResponse) {
        return res.send(drugResponse);
      }
    })
    .catch(_ => res.status(500).send({ error: "Internal server error." }));
};
module.exports.searchDrugs = (req, res) => {
  const query = req.query.query;
  const callUrl = `https://healthtools.aarp.org/v2/druginputautocomplete?query=${query}&out=json`;
  if (!query) {
    return res.status(406).send({ error: "Empty query" });
  }
  axios.default
    .get(callUrl)
    .then(response => {
      const drugs = response.data.Drugs.filter(drug => drug.url.length != 0);
      drugs.forEach(drug => {
        delete drug.imuid;
        delete drug.datasource;
        drug.brandName = drug.Term;
        delete drug.Term;
        drug.genericName = drug.GenericTerm;
        delete drug.GenericTerm;
        delete drug.url;
      });
      return res.send({ drugs });
    })
    .catch(err => console.log(err));
};
