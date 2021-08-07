export const getUidFieldsByContentType = (contentType) => {
  const uidFieldNames = [];

  Object.entries(contentType.attributes).map(([i, e]) => {
    if (e.type === "uid") {
      uidFieldNames.push(i);
    }
  });

  return uidFieldNames;
};
