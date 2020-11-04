const {AbilityBuilder, Ability } = require('@casl/ability');

const policies = {

    guest(user , {can}){
        can('read','Product')
    },

    user(user , {can}){
        // melihat list  Order
        can('view', 'Order')

        //membuat Order
        can('create', 'Order')

        //membaca Order miliknya
        can('read', 'Order', {user_id : user._id})

        //mengupdate User miliknya
        can('update', 'User', {_id : user._id})

        //mengupdate Cart miliknya
        can('update', 'Cart', {user_id : user._id})

         //memcaba Cart miliknya
         can('read', 'Cart', {user_id : user._id})

          //melihat daftar deliver
          can('view', 'DeliveryAddress')

          //membuat delivery milikny 
          can('create', 'DeliveryAddress', {user_id : user._id})

        //udate delivery milikny 
          can('update', 'DeliveryAddress', {user_id : user._id})

        //membaca delivery milikny 
          can('read', 'DeliveryAddress', {user_id : user._id})
        
        //delete delivery milikny 
        can('delete', 'DeliveryAddress', {user_id : user._id})

        //membaca invoce milikny 
        can('read', 'Invoice', {user_id : user._id})

    },

    admin(user, {can}){
        can('manage','all')
    }

}

function policyFor(user) {
    
    let builder = new AbilityBuilder();

    if (user && typeof policies[user.role] === 'function') {
        policies[user.role](user, builder)
    } else {
        policies['guest'](user, builder)
    }

    return new Ability(builder.rules);
}


module.exports = {
    policyFor
}