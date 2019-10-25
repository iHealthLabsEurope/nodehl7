/*global describe */
/*global before */
/*global it */
/*global after */

(function(logger){
	'use strict';
	var path = require('path'),
		expect = require('chai').expect,
		should = require('chai').should,
		Hl7lib = require(path.join(__dirname, '..', 'lib', 'hl7')),
		config = config = {
			"mapping": false,
			"profiling": true,
			"debug": true,
			"fileEncoding": "iso-8859-1"
		};

	if (typeof describe === 'function'){
		describe('Hl7Lib test', function(){
			var	hl7parser;
			before(function(){
				hl7parser = new Hl7lib(config.hl7parser);
			});
			it('should be able to parse existing files', function(done){
				hl7parser
					.parseFile(path.join(__dirname, './testfiles/ADTA01.adm'),
						function(err, message){
							should(err).not.exist();
							expect(message).to.have.a.property('segments');
							done();
						}
					);
			});
			it('should be able to parse HL7 2.3.1 files and get field values', function(done){
				hl7parser
					.parseFile(path.join(__dirname, './testfiles/ADTA01.adm'),
						function(err, message){
							should(err).not.exist();
							expect(message).to.have.a.property('segments');
							expect(message.get('MSH', 'Version ID')).equal('2.3.1');
							done();
						}
					);
			});
			it('should be able to parse HL7 2.3.1 files and set field values', function(done){
				hl7parser
					.parseFile(path.join(__dirname, './testfiles/ADTA01.adm'),
						function(err, message){
							should(err).not.exist();
							expect(message).to.have.a.property('segments');
							message.set('MSH', 'Version ID', '2.3.2');
							expect(message.get('MSH', 'Version ID')).equal('2.3.2');
							done();
						}
					);
			});
			it('expect to warn when it parses non existing files', function(done){
				hl7parser
					.parseFile(path.join(__dirname, './testfiles/ADTA01RAND.adm'),
						function(err){
							expect(err).to.have.a.property('errno');
							done();
						}
					);
			});
			it('expect to parse large files', function(done){
				hl7parser
					.parseFile(path.join(__dirname, './testfiles/birp_ORUR01.adm'),
						function(err, message){
							should(err).not.exist;
							expect(message).to.have.a.property('segments');
							//logger.log(message);
							//expect(message.segments).to.have.a.property('segments');
							done();
						}
					);
			});

			it('should be able to parse HL7 2.5 version of files with repetition', function(done) {
				hl7parser.parseFile(path.join(__dirname, './testfiles/patient1.hl7'), (err, message) => {
					should(err).not.exist();
					expect(message).to.have.a.property('segments');
					expect(message.getValue('PID.F-3.R-1.C-1.S-1')).to.eq('85624')
					expect(message.getValue('PID.F-3.R-1.C-4.S-1')).to.eq('DPI GRIMOIRE')
					expect(message.getValue('PID.F-3.R-1.C-5.S-1')).to.eq('PI')
					done();
				});
			});
			it('should be able to parse HL7 2.5 version of files with repetition and correct value', function(done) {
				hl7parser.parseFile(path.join(__dirname, './testfiles/patient2.hl7'), (err, message) => {
					should(err).not.exist();
					expect(message).to.have.a.property('segments');
					expect(message.getValue('PID.F-3.R-1.C-1.S-1')).to.eq('1800080888');
					expect(message.getValue('PID.F-3.R-1.C-4.S-1')).to.eq('MIPIH');
					expect(message.getValue('PID.F-3.R-1.C-5.S-1')).to.eq('PI');
					expect(message.getValue('PID.F-3.R-1.C-6.S-1')).to.eq('CHU DE POITIERS');
					expect(message.getValue('PID.F-3.R-1.C-6.S-2')).to.eq('860014208');
					expect(message.getValue('PID.F-3.R-1.C-6.S-3')).to.eq('FINEJ');
					expect(Array.isArray(message.getValue('PID.F-3'))).to.eq(true);
					expect(message.getValue('PID.F-11.R-1')).to.eq(null);
					done()
				});
			});
			it('should be able to parse HL7 2.5 version of files with pv1 segment', function(done) {
				hl7parser.parseFile(path.join(__dirname, './testfiles/patient4.hl7'), (err, message) => {
					should(err).not.exist();
					expect(message).to.have.a.property('segments');
					expect(message.getValue('PV1.F-3.R-1.C-4.S-2')).to.eq('860014208');
					expect(message.getValue('PV1.F-3.R-1.C-1.S-1')).to.eq('4400');
					done()
				});
			})
			after(function(){

			});
		});
	}
})(console);
