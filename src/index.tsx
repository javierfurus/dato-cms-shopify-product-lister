import { connect, RenderModalCtx, OnBootCtx } from 'datocms-plugin-sdk';
import { render } from './utils/render';
import ConfigScreen from './entrypoints/ConfigScreen';
import BrowseProductsModal from './components/BrowseProductsModal';
import FieldExtension from './entrypoints/FieldExtension';
import 'datocms-react-ui/styles.css';
import { isValidConfig, normalizeConfig } from './types';

const FIELD_EXTENSION_ID = 'shopifyProductLister';

connect({
  async onBoot(ctx: OnBootCtx) {
    if (
      !ctx.currentRole.meta.final_permissions.can_edit_schema ||
      isValidConfig(ctx.plugin.attributes.parameters)
    ) {
      return;
    }

    const fields = await ctx.loadFieldsUsingPlugin();

    const someUpgraded = (
      await Promise.all(
        fields.map(async (field) => {
          if (
            field.attributes.appearance.editor !== ctx.plugin.id ||
            field.attributes.appearance.field_extension === FIELD_EXTENSION_ID
          ) {
            return false;
          }

          await ctx.updateFieldAppearance(field.id, [
            {
              operation: 'updateEditor',
              newFieldExtensionId: FIELD_EXTENSION_ID,
            },
          ]);

          return true;
        }),
      )
    ).some((x) => x);

    await ctx.updatePluginParameters(
      normalizeConfig(ctx.plugin.attributes.parameters),
    );

    if (someUpgraded) {
      ctx.notice('Plugin upgraded successfully!');
    }
  },
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  manualFieldExtensions() {
    return [
      {
        id: FIELD_EXTENSION_ID,
        name: 'Shopify Product Lister',
        type: 'editor',
        fieldTypes: ['string'],
      },
    ];
  },
  overrideFieldExtensions(field, ctx) {
    const config = normalizeConfig(ctx.plugin.attributes.parameters);

    if (field.attributes.field_type !== 'string') {
      return;
    }

    if (
      !config.autoApplyToFieldsWithApiKey ||
      !new RegExp(config.autoApplyToFieldsWithApiKey).test(
        field.attributes.api_key,
      )
    ) {
      return;
    }

    return {
      editor: { id: FIELD_EXTENSION_ID },
    };
  },
  renderFieldExtension(id, ctx) {
    render(<FieldExtension ctx={ctx} />);
  },
  renderModal(modalId: string, ctx: RenderModalCtx) {
    switch (modalId) {
      case 'browseProducts':
        return render(<BrowseProductsModal ctx={ctx} />);
    }
  },
});
