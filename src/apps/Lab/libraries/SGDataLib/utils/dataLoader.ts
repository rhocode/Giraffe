const dataLoader = (
  tableListFunc: any,
  database: any,
  tableMapping: any,
  tableCallback: any,
  versionCallback: any
) => {
  database.collection('versions').onSnapshot(function(querySnapshot: any) {
    const versions: any = [];
    querySnapshot.forEach(function(doc: any) {
      versions.push(doc.id);
    });

    versionCallback(versions);
    const tableList: string[] = tableListFunc(versions);

    tableList.forEach(tableName => {
      const pathArray: string[] = tableName.split('/');
      const lastTableName = pathArray[pathArray.length - 1];
      let i: number = 0;
      let ref: any = database;

      pathArray.forEach((item: string) => {
        if (i % 2 === 0) {
          ref = ref.collection(item);
        } else {
          ref = ref.doc(item);
        }

        i++;
      });

      const tableRef = ref;
      tableRef.onSnapshot((snapshot: any): any => {
        const returnMapping: any[] = [];
        snapshot.forEach((doc: any) => {
          const dataMapping = tableMapping[lastTableName];

          const item = dataMapping.fromFirebase(doc);
          returnMapping.push({ id: doc.id, data: item });
        });

        tableCallback(tableName, returnMapping);
      });
    });
  });
};

export default dataLoader;
