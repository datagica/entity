'use strict';

function cleanTextForId(input){
  const res = (typeof input === 'object' && typeof input.en === 'string')
    ? input
    : `${input}`.trim().toLowerCase().replace(/\s/g, '-');
  return res;

}

function cleanTextForLabel(input){
  const res = (typeof input === 'object' &&
    typeof input.en === 'string')
    ? input
    : `${input}`.trim();
    return res;
}

function textOrEnForId(input) {
  return (typeof input === 'string')
    ? input
    : (typeof input === 'undefined')
      ? null
      : (Array.isArray(input) && input.length > 0)
        ? textOrEnForId(input[0])
        : (typeof input.en === 'string' && input.en.length > 0)
          ? input.en
          : null
}

function textOrEnForLabel(input) {
  return (typeof input === 'string')
    ? { en: input }
    : (typeof input === 'undefined')
      ? null
      : (Array.isArray(input) && input.length > 0)
        ? textOrEnForLabel(input[0])
        : (typeof input.en === 'string' && input.en.length > 0)
          ? JSON.parse(JSON.stringify(input))
          : null
}

function isNullEmptyOrUndefined(input) {
  return (input    ==  null              ||
      input        === 'null'            ||
      input        === ''                ||
      input        === '[object Object]' ||
      typeof input === 'undefined'       ||
      input        === 'undefined'
    );
}

function isValidId(input) {
  if (isNullEmptyOrUndefined(input)) {
    return false;
  }
  return (typeof input === 'string' && input.length > 0);
}

function isValidLabel(input) {
  if (isNullEmptyOrUndefined(input)) {
    return false;
  }
  if (typeof input === 'string' && input.length > 0) {
    return true;
  }
  return (typeof input    === 'object' &&
          typeof input.en === 'string' &&
          input.en.length > 0)
}


function Entity(input, meta){

  if (isNullEmptyOrUndefined(input)) return;

  const type = typeof input;

  const isString = type === 'string';
  const isNumber = type === 'number';
  const isBoolean = type === 'boolean';
  const isArray = Array.isArray(input);

  if (isArray) {
    return input
      .map(i    =>  Entity(i))
      .filter(e => !isNullEmptyOrUndefined(e))
  }

  const id = cleanTextForId(

     // trivial case: input can be formatted to text
     (isString || isNumber || isBoolean) ? input

       // trivial case: there is already an id
       : (typeof input.id !== 'undefined')  ? input.id

       // a bit less trivial: no idea, we need to infer (most abstract fields in priority)
       : textOrEnForId(
           (typeof input.label !== 'undefined') ? input.label
         : (typeof input.name  !== 'undefined') ? input.name
         : (typeof input.title !== 'undefined') ? input.title

         // oh wait: this is probably a translation block!
         : (typeof input.en    !== 'undefined') ? input
         : (typeof input.fr    !== 'undefined') ? input

         // no luck
         : ''
     )
  );

  if (!isValidId(id)) return;

  const label = cleanTextForLabel(

    // trivial case: input can be formatted to text
    (isString || isNumber || isBoolean) ? input

       // a bit less trivial: no idea, we need to infer (most abstract fields in priority)
       : textOrEnForLabel(
           (typeof input.label !== 'undefined') ? input.label
         : (typeof input.name  !== 'undefined') ? input.name
         : (typeof input.title !== 'undefined') ? input.title

         // oh wait: this is probably a translation block!
         : (typeof input.en    !== 'undefined') ? input
         : (typeof input.fr    !== 'undefined') ? input

         // ok.. let's try the ugly machine readable code
         : (typeof input.id    !== 'undefined') ? input.id

         // no luck
         : ''
     )
  );

  if (!isValidLabel(label)) return;

  const value =
      (isString)              ? `${input}`
    : (isNumber || isBoolean) ? input
    : (isArray)               ? JSON.parse(JSON.stringify(input))
    : (typeof input.value !== 'undefined') ? JSON.parse(JSON.stringify(input.value))
    : JSON.parse(JSON.stringify(input));

  const output = {
    id: id,
    label: label,
    value: value // make a copy of the input data
  }

  // optional attributes
  if (typeof meta !== 'undefined') {
    Object.keys(meta).forEach(key => {
      output[key] = meta[key]
    })
  }
  return output;
}

module.exports = Entity
module.exports.default = Entity
module.exports.entity = Entity
module.exports.Entity = Entity
