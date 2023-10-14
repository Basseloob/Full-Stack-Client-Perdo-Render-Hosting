//Mysql Table :

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  //   // It defines a one-to-many relationship between the Posts model and the Comments model.
  //   // This means that a post can have many comments,
  //   // but a comment can only belong to one post. When a post is deleted,
  //   // all of its associated comments will also be deleted.
  Users.associate = (models) => {
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });

    // This will create the user id filled in the Post Table :::::: means user can have many diffrenet posts :
    // will create a field named UserId inside the Posts table in MySql :
    Users.hasMany(models.Posts, {
      onDelete: "cascade",
    });
  };

  return Users;
};
