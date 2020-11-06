export const getUidFieldsByContentType = (contentType) => {
  let uidFieldNames = [];
  
  Object.entries(contentType.schema.attributes).map(([i, e]) => {
    if (e.type === "uid") {
      uidFieldNames.push(i);
    }
  });

  return uidFieldNames;
};