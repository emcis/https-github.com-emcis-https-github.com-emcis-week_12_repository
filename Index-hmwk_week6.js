
class Unicorn {
    constructor(name, color, region) {
        this.name = name;
        this.color = color;
        this.region = region;
        this.powers = [];
    }
    addPower(name, effect, damage, strikes) {
        this.powers.push(new Power(name, effect, damage, strikes));
    }
} 

class Power {
    constructor(name, effect, damage, strikes) {
        this.name = name;
        this.effect = effect;
        this.damage = damage;
        this.strikes = strikes;
    }
}  

class UnicornService {
    static url =  "https://crudcrud.com/api/467446f2b41f4ea58e1a553fd9faaf72/unicorns";

  
    static getAllUnicorns() {
        return $.get(this.url);
    }

    static getUnicorn(id) {
        return $.get(this.url + `/${id}`);
    }


    static createUnicorn(unicorn) {
        return $.ajax({
            url: this.url,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(unicorn),
            type: 'POST'
        });
    }

 
    static updateUnicorn(unicorn) {
        return fetch(  `${this.url}/${unicorn._id}`, {
            method: 'PUT',
            headers : new Headers ({
                    'Content-Type': 'application/json'
            }),      
            body: JSON.stringify({"name" : unicorn.name, "color" : unicorn.color, "region" : unicorn.region, "powers" : unicorn.powers}),
        });
    }



    static deleteUnicorn(id) {
        return $.ajax({
            url:  `${this.url}/${id}`,
            type: 'DELETE'
        });
    }
} 


class DOMManager {
    static unicorns;

    static getAllUnicorns() {
        UnicornService.getAllUnicorns().then(unicorns => this.render(unicorns));
    }

    static createUnicorn(name,color,region) {
        console.log(`Creating a unicorn named: ${name}!`);
        UnicornService.createUnicorn(new Unicorn (name,color,region))
            .then(() => {
                return UnicornService.getAllUnicorns();
            })
            .then((unicorns) => this.render(unicorns));
    } 

    static deleteUnicorn(id) {
        console.log(`Deleting a unicorn!`);
        UnicornService.deleteUnicorn(id)
            .then(() => {
                return UnicornService.getAllUnicorns();
            })
            .then((unicorns) => this.render(unicorns));       
    } 

    static addPower(id) {
        for (const unicorn of this.unicorns) {
            if (unicorn._id == id) {
                unicorn.powers.push(new Power($(`#${unicorn._id}-power-name`).val(), $(`#${unicorn._id}-power-effect`).val(), $(`#${unicorn._id}-power-damage`).val(), $(`#${unicorn._id}-power-strikes`).val()));
                console.log('Adding power:' + $(`#${unicorn._id}-power-name`).val());
                UnicornService.updateUnicorn(unicorn)
                    .then(() => {
                        return DOMManager.getAllUnicorns();
                    });
            } 
        } 
    } 

    static deletePower(unicornId, powerName) {
        for (const unicorn of this.unicorns) {
            if (unicorn._id == unicornId) {
                for (let i = 0; i < unicorn.powers.length; i++) {
                    const power = unicorn.powers[i];
                    if (power.name == powerName) {
                        unicorn.powers.splice(i, 1);
                        console.log('Deleting power: ' + powerName);
                        UnicornService.updateUnicorn(unicorn)
                            .then(() => {
                                return DOMManager.getAllUnicorns();
                            });                     
                    } 
                } 
            } 
        } 
    } 

    static decrementPower(unicornId, powerName) {
        for (const unicorn of this.unicorns) {
            if (unicorn._id == unicornId) {
                for (let i = 0; i < unicorn.powers.length; i++) {
                    const power = unicorn.powers[i];
                    if (power.name == powerName) {
                        if (unicorn.powers[i].strikes == 0) {
                            console.log(`No power: ${unicorn.powers[i].name} out of stock!`)
                        } else {
                            unicorn.powers[i].strikes -= 1;
                            console.log('Decremented ' + powerName + ' strikes.  New total: ' + `${unicorn.powers[i].strikes}`);
                            UnicornService.updateUnicorn(unicorn)
                                .then(() => {
                                    return DOMManager.getAllUnicorns();
                                });       
                        }            
                    } 
                } 
            } 
        } 
    } 

    static incrementPower(unicornId, powerName) {
        for (const unicorn of this.unicorns) {
            if (unicorn._id == unicornId) {
                for (let i = 0; i < unicorn.powers.length; i++) {
                    const power = unicorn.powers[i];
                    if (power.name == powerName) { 
                        unicorn.powers[i].strikes++;
                        console.log('Incremented ' + powerName + ' strikes.  New total: ' + `${unicorn.powers[i].strikes}`);
                        UnicornService.updateUnicorn(unicorn)
                            .then(() => {
                                return DOMManager.getAllUnicorns();
                            });       
                    } 
                } 
            } 
        } 
    } 

    static render(unicorns) {
        this.unicorns = unicorns;
        $('#app').empty();
       
        for (let unicorn of unicorns) {
            
            $('#app').prepend(
                `
                <br><div id="${unicorn._id}" class="card border border-primary">
                    <div class="card-header">
                        <h2>${unicorn.name}</h2>
                        <h6> Region:  ${unicorn.region}</h6>
                        <button class="btn btn-danger" onclick="DOMManager.deleteUnicorn('${unicorn._id}')">Delete Unicorn</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm center">
                                    <input type="text" id="${unicorn._id}-power-name" class="form-control" placeholder="Unicorn Power"> <br>
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${unicorn._id}-power-effect" class="form-control" placeholder="Power Effect"><br>
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${unicorn._id}-power-damage" class="form-control" placeholder="Damage Points"><br>
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${unicorn._id}-power-strikes" class="form-control" placeholder="Number of Power Strikes"><br>
                                </div>
                            </div>
                            <br>
                            <button id="${unicorn._id}-new-power" onclick="DOMManager.addPower('${unicorn._id}')" class="btn btn-primary form-control">Add Power</button>
                        </div>
                    </div>
                </div><br>`
            );      
            if (unicorn.powers == null) {
                console.log(`Power list for unicorn: ${unicorn.name} is empty!`);
            } else {
                $(`#${unicorn._id}`).find('.card-body').append(`<br>`);
                for (const power of unicorn.powers) {  
                 
                    $(`#${unicorn._id}`).find('.card-body').append(
                        `<p>
                            <span id="name-${power.name}"><strong>Unicorn Power: </strong> ${power.name}</span>
                            <span id="effect-${power.name}"><strong>Power Effect: </strong> ${power.effect}</span><br>
                            <span id="damage-${power.name}"><strong>Damage Points: </strong> ${power.damage}</span><br>
                            <span id="strikes-${power.name}"><strong>Number of Strikes: </strong> ${power.strikes}&nbsp;&nbsp;</span>
                            <button id="${unicorn._id}-${power.name}-increase number of strikes" onclick="DOMManager.incrementPower('${unicorn._id}', '${power.name}')"  class="btn btn-success">Increase Strikes</button>
                            <button id="${unicorn._id}-${power.name}-decrease number of strikes" onclick="DOMManager.decrementPower('${unicorn._id}', '${power.name}')"  class="btn btn-warning">Decrease Strikes</button>
                            <button id="${unicorn._id}-${power.name}-delete-power" onclick="DOMManager.deletePower('${unicorn._id}', '${power.name}')"  class="btn btn-danger">Delete Power</button>&nbsp;&nbsp;
                            `
                    );   
                } 
            } 
        } 
    } 
} 


$('#create-new-unicorn').on('click', () => {
    console.log("New Unicorn!");
    DOMManager.createUnicorn($('#new-unicorn-name').val(), $('#new-unicorn-color').val(), $('#new-unicorn-region').val());
    $('#new-unicorn-name').val('');
    $('#new-unicorn-color').val('');
    $('#new-unicorn-region').val('');
});

DOMManager.getAllUnicorns();
 