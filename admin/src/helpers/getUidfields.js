export const getUidFieldsByContentType = (contentType) => {
  let uidFieldNames = [];
  
  Object.entries(contentType.attributes).map(([i, e]) => {
    if (e.type === "uid") {
      uidFieldNames.push(i);
    }
  });

  return uidFieldNames;
};