var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/cypress-xpath/src/index.js
var require_src = __commonJS({
  "node_modules/cypress-xpath/src/index.js"() {
    var xpath = (subject, selector, options = {}) => {
      const isNumber = (xpathResult) => xpathResult.resultType === XPathResult.NUMBER_TYPE;
      const numberResult = (xpathResult) => xpathResult.numberValue;
      const isString = (xpathResult) => xpathResult.resultType === XPathResult.STRING_TYPE;
      const stringResult = (xpathResult) => xpathResult.stringValue;
      const isBoolean = (xpathResult) => xpathResult.resultType === XPathResult.BOOLEAN_TYPE;
      const booleanResult = (xpathResult) => xpathResult.booleanValue;
      const isPrimitive = (x) => Cypress._.isNumber(x) || Cypress._.isString(x) || Cypress._.isBoolean(x);
      const log = {
        name: "xpath",
        message: selector
      };
      if (Cypress.dom.isElement(subject) && subject.length > 1) {
        throw new Error(
          "xpath() can only be called on a single element. Your subject contained " + subject.length + " elements."
        );
      }
      const getValue = () => {
        let nodes = [];
        let contextNode;
        let withinSubject = cy.state("withinSubject");
        if (Cypress.dom.isElement(subject)) {
          contextNode = subject[0];
        } else if (Cypress.dom.isDocument(subject)) {
          contextNode = subject;
        } else if (withinSubject) {
          contextNode = withinSubject[0];
        } else {
          contextNode = cy.state("window").document;
        }
        let iterator = (contextNode.ownerDocument || contextNode).evaluate(
          selector,
          contextNode
        );
        if (isNumber(iterator)) {
          const result = numberResult(iterator);
          log.consoleProps = () => {
            return {
              XPath: selector,
              type: "number",
              result
            };
          };
          return result;
        }
        if (isString(iterator)) {
          const result = stringResult(iterator);
          log.consoleProps = () => {
            return {
              XPath: selector,
              type: "string",
              result
            };
          };
          return result;
        }
        if (isBoolean(iterator)) {
          const result = booleanResult(iterator);
          log.consoleProps = () => {
            return {
              XPath: selector,
              type: "boolean",
              result
            };
          };
          return result;
        }
        try {
          let node = iterator.iterateNext();
          while (node) {
            nodes.push(node);
            node = iterator.iterateNext();
          }
          log.consoleProps = () => {
            return {
              XPath: selector,
              result: nodes.length === 1 ? nodes[0] : nodes
            };
          };
          return nodes;
        } catch (e) {
          console.error("Document tree modified during iteration", e);
          return null;
        }
      };
      const resolveValue = () => {
        return Cypress.Promise.try(getValue).then((value) => {
          if (!isPrimitive(value)) {
            value = Cypress.$(value);
            value.selector = selector;
          }
          return cy.verifyUpcomingAssertions(value, options, {
            onRetry: resolveValue
          });
        });
      };
      return resolveValue().then((value) => {
        if (options.log !== false) {
          Cypress.log(log);
        }
        return value;
      });
    };
    Cypress.Commands.add(
      "xpath",
      { prevSubject: ["optional", "element", "document"] },
      xpath
    );
  }
});

// cypress/support/locators/perfil_locators.js
var Perfil_Locators = class {
  // ========================
  // MENU / AÇÕES DE CONTA
  // ========================
  menuPerfil = '[data-testid="btn-perfil"]';
  botaoEncerrarSessao = '[data-testid="btn-encerrar-sessao"]';
  // ========================
  // TÍTULO
  // ========================
  tituloPagina = "Meu perfil";
  // ========================
  // CARD PRINCIPAL
  // ========================
  nomeUsuario = "h2.text-xl.font-bold";
  contaAtiva = "Conta ativa";
  ultimoAcesso = "\xDAltimo acesso";
  tempoSessao = "Tempo de sess\xE3o";
  // ========================
  // DADOS PESSOAIS
  // ========================
  cardDadosPessoais = "Dados pessoais";
  nomeCompleto = "Nome completo";
  cpf = "CPF";
  email = "E-mail";
  cargo = "Cargo";
  coordenadoria = "Coordenadoria";
  // ========================
  // ÁREAS DE ACESSO
  // ========================
  cardAreas = "\xC1reas de acesso";
  // ========================
  // VALOR VAZIO (placeholder exibido pela tela quando o dado não existe)
  // ========================
  campoVazio = "\u2014";
};
var perfil_locators_default = Perfil_Locators;

// cypress/support/commands_ui/perfil_commands.js
require_src();
var PERFIL = new perfil_locators_default();
Cypress.Commands.add("abrirPerfil", () => {
  cy.get(PERFIL.menuPerfil, { timeout: 3e4 }).should("be.visible").click({ force: true });
  cy.contains(PERFIL.tituloPagina, { timeout: 3e4 }).should("be.visible");
});
Cypress.Commands.add("validarTituloPerfil", () => {
  cy.contains(PERFIL.tituloPagina, { timeout: 3e4 }).should("be.visible");
});
Cypress.Commands.add("validarCardUsuario", () => {
  cy.contains(PERFIL.contaAtiva, { timeout: 3e4 }).should("be.visible");
});
Cypress.Commands.add("validarNomeUsuario", () => {
  cy.get(PERFIL.nomeUsuario, { timeout: 3e4 }).should("be.visible").invoke("text").should("not.be.empty");
});
Cypress.Commands.add("validarUltimoAcesso", () => {
  cy.contains(PERFIL.ultimoAcesso, { timeout: 3e4 }).should("be.visible");
});
Cypress.Commands.add("validarTempoSessao", () => {
  cy.contains(PERFIL.tempoSessao, { timeout: 3e4 }).should("be.visible");
});
Cypress.Commands.add("validarCardDadosPessoais", () => {
  cy.contains(PERFIL.cardDadosPessoais, { timeout: 3e4 }).should("be.visible");
});
Cypress.Commands.add("validarCampoNomeCompleto", () => {
  cy.contains(PERFIL.nomeCompleto, { timeout: 3e4 }).should("be.visible");
});
Cypress.Commands.add("validarCampoCPF", () => {
  cy.contains(PERFIL.cpf, { timeout: 3e4 }).should("be.visible");
});
Cypress.Commands.add("validarCampoEmail", () => {
  cy.contains(PERFIL.email, { timeout: 3e4 }).should("be.visible");
});
Cypress.Commands.add("validarCampoCargo", () => {
  cy.contains(PERFIL.cargo, { timeout: 3e4 }).should("be.visible");
});
Cypress.Commands.add("validarCampoCoordenadoria", () => {
  cy.contains(PERFIL.coordenadoria, { timeout: 3e4 }).should("be.visible");
});
Cypress.Commands.add("validarCampoPossuiValor", (campo) => {
  cy.contains(campo, { timeout: 3e4 }).parent().invoke("text").then((texto) => {
    const valor = texto.replace(campo, "").trim();
    expect(valor).to.not.equal("");
    expect(valor).to.not.equal(PERFIL.campoVazio);
  });
});
Cypress.Commands.add("validarCpfMascarado", () => {
  cy.contains(PERFIL.cpf, { timeout: 3e4 }).parent().invoke("text").then((texto) => {
    expect(texto, "CPF n\xE3o est\xE1 mascarado").to.match(/\d{3}\.\d{3}\.xxx-xx/i);
  });
});
Cypress.Commands.add("validarCardAreas", () => {
  cy.contains(PERFIL.cardAreas, { timeout: 3e4 }).should("be.visible");
});
Cypress.Commands.add("validarArea", (area) => {
  cy.contains(area, {
    timeout: 3e4
  }).should("be.visible");
});
Cypress.Commands.add("validarPermissao", (permissao) => {
  cy.contains(permissao, {
    timeout: 3e4
  }).should("be.visible");
});
Cypress.Commands.add("validarBotaoEncerrarSessao", () => {
  cy.get(PERFIL.botaoEncerrarSessao, { timeout: 3e4 }).should("be.visible");
});
Cypress.Commands.add("clicarEncerrarSessao", () => {
  cy.get(PERFIL.botaoEncerrarSessao).scrollIntoView().click({ force: true });
});
