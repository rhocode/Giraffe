const resolvers = {
  Query: {
    test(obj: any, args: any, context: any, info: any) {
      return 'Hello!';
    }
  }
};

export default resolvers;
