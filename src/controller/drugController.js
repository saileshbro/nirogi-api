const axios = require("axios");
var sanitizeHtml = require("sanitize-html");
const baseUrl = "https://healthtools.aarp.org";
module.exports.getCommonDrugs = (req, res) => {
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
                sections,
                summary: headerSummary
              });
            }

            if (resolved == drugsArray.length) {
              return drugResponse;
            }
          })
          .then(drugResponse => {
            if (drugResponse) {
              drugResponse.sort((a, b) => (a.brandName < b.brandName ? -1 : 1));
              return res.send({ drugs: drugResponse });
            }
          })
          .catch(_ => res.status(500).send({ error: _ }));
      }
    })
    .catch(_ => res.status(500).send({ error: _ }));
};

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
  const drugResponse = [];
  const query = req.query.query;
  let resolved = 0;
  axios.default
    .get(
      `https://healthtools.aarp.org/v2/druginputautocomplete?query=${query}&out=json`
    )
    .then(response => {
      const drugs = response.data.Drugs;
      let toCall = drugs
        .filter(drug => {
          return drug.url !== "";
        })
        .map(drug => drug.GenericTerm);

      drugsArray = [...new Set(toCall)].filter(item => item.length !== 0);
      for (const drug of drugsArray) {
        const callUrl = `${baseUrl}/goldcontent/${drug}?out=json`;
        axios.default
          .get(callUrl)
          .then(response => {
            if (response.status === 200) {
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
              const tosendList = [];
              const headerSummary = json.headerSummary;
              const sections = [];
              for (const [index, object] of Object.entries(subSections)) {
                sections.push(object);
              }
              sections.forEach(section => {
                section.title = section.title
                  .replace(/<[^>]+>/g, "")
                  .replace(/\n/g, "");
              });
              Object.values(json.imageGroupMap).forEach(item => {
                tosendList.push({
                  drugs: {
                    dose: item.pillImages[0].dosage,
                    imageUrl: `${baseUrl}/images/${
                      item.pillImages[0].fullImagePath
                    }`,
                    brandName: item.pillImages[0].brandName,
                    genericName: genericName,
                    summary: headerSummary,
                    sections: sections
                  }
                });
              });
              if (brandName.length > 0) {
                drugResponse.push(...tosendList);
              }
              const finalResponse = drugResponse.map(item => {
                return item.drugs;
              });
              if (resolved == drugsArray.length) {
                return finalResponse;
              }
            }
          })
          .then(drugResponse => {
            if (drugResponse) {
              drugResponse.sort((a, b) => (a.brandName < b.brandName ? -1 : 1));
              return res.send({ drugs: drugResponse });
            }
          })
          .catch(_ => res.status(500).send({ error: _ }));
      }
    })
    .catch(_ => res.status(500).send({ error: "out" }));
};
