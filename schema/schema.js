const graphql = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () =>  ({
        id: {type: GraphQLString},
        firstName: { type: GraphQLString },
        age: { type: GraphQLString},
        category: {
            type: CategoryType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/category/${parentValue.categoryId}`)
                    .then(res => res.data)
            }
        }
    })
});

const CategoryType = new GraphQLObjectType({
    name: "Category",
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString }
    })
});

const mutation = new GraphQLObjectType({
    name:  'Mutation',
    fields: {
        addUser: {
           type: UserType,
            args: {
               firstName: { type: new GraphQLNonNull(GraphQLString)},
               age: { type: new GraphQLNonNull(GraphQLInt) },
               categoryId: { type: GraphQLString }
            },
            resolve(parentValue, { firstName, age }) {
               return axios.post('http://localhost:300/users', {firstName, age})
                .then(res => res.data);
            }
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp => resp.data)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});