export const paginate = (schema: any) => {
  schema.statics.paginate = async function (filter: any, options: any) {
    const limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? parseInt(options.limit, 10)
        : 10;
    const page =
      options.page && parseInt(options.page, 10) > 0
        ? parseInt(options.page, 10)
        : 1;
    const skip = (page - 1) * limit;

    // Step 1: Get All Documents
    let docsPromise = this.find(filter);

    // Step 2: Populate Fields
    if (Array.isArray(options.populate)) {
      options.populate.forEach((populateOption: any) => {
        docsPromise = docsPromise.populate(populateOption);
      });
    }

    // Step 3: Execute Query & Get Fully Populated Data
    let results = await docsPromise.exec();

    // Step 4: Apply `q` Filtering (if provided)
    if (options.q?.term && options.q?.fields) {
      const fields = Array.isArray(options.q.fields)
        ? options.q.fields
        : [options.q.fields];

      results = results.filter((item: any) => {
        return fields.some((fieldPath: string) => {
          const fieldValue = fieldPath
            .split(".")
            .reduce((obj: any, key: any) => obj?.[key], item);
          return (
            typeof fieldValue === "string" &&
            fieldValue.toLowerCase().includes(options.q.term.toLowerCase())
          );
        });
      });
    }
    // Step 5: Apply Sorting (after filtering)
    if (options.sortBy) {
      const sortField = options.sortBy;
      const sortOrder = options.order === "desc" ? -1 : 1;

      results = results.sort((a: any, b: any) => {
        const fieldA = sortField
          .split(".")
          .reduce((obj: any, key: any) => obj?.[key], a);
        const fieldB = sortField
          .split(".")
          .reduce((obj: any, key: any) => obj?.[key], b);

        if (fieldA === undefined || fieldB === undefined) return 0; // Handle missing values
        if (fieldA < fieldB) return -1 * sortOrder;
        if (fieldA > fieldB) return 1 * sortOrder;
        return 0;
      });
    } else {
      // default sorting by createdAt
      results = results.sort((a: any, b: any) => {
        const fieldA = a.createdAt;
        const fieldB = b.createdAt;
        if (fieldA === undefined || fieldB === undefined) return 0; // Handle missing values
        if (fieldA < fieldB) return -1;
        if (fieldA > fieldB) return 1;
        return 0;
      });
    }

    // Step 6: Paginate after Sorting
    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / limit);
    results = results.slice(skip, skip + limit); // Apply pagination manually

    return {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
  };
};
